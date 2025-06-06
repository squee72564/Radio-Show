# ICECAST INFO
host = environment.get("ICECAST_HOST", default="icecast")
port = int_of_string(environment.get("ICECAST_PORT", default="8000"))
password = environment.get("ICECAST_PASSWORD", default="hackme")
mount = environment.get("ICECAST_MOUNT", default="live")
name = environment.get("ICECAST_NAME", default="radio show")

# HARBOR INFO FOR USER
harborPassword = environment.get("HARBOR_PASSWORD", default="securepassword")
harborPort = int_of_string(environment.get("HARBOR_PORT", default="8005"))
harborMount = environment.get("HARBOR_MOUNT", default="/dj")

# WEBSITE URL FOR HTTP REQUESTS
siteURL = environment.get("SITE_URL", default="http://host.docker.internal:3000")

# REFS FOR META AND LIVE STREAM
current_meta = ref(
  [("title", "None"), ("genre", "None")]
);
live_stream_ref = ref(null())       # Ref for livestream; used in callbacks declared before livestream defined

client_addr_ref = ref(null())       # Keeps track of client 
client_timelimit_ref = ref(null())  # Keeps track of client timelimit

disconnect_called_ref = ref(false)  # Keeps track of if disconnect callback was called

# This callback captures the response data from the authentication
# POST request and attaches related metadata like artist and title
def respDataCallback(dataOpt)
  dataJsonString = dataOpt ?? null()

  if null.defined(dataJsonString) then
    try
      let json.parse ( dataJson : {
        authenticated : bool,
        meta: {
          title: string,
          user: string,
          timelimit: float
        }
      }) = null.get(dataJsonString)

      client_timelimit_ref := dataJson.meta.timelimit

      current_meta := [
        ("title", dataJson.meta.title),
        ("artist", dataJson.meta.user)
      ]

      if null.defined(live_stream_ref()) then
        null.get(live_stream_ref()).insert_metadata(current_meta())
      else
        log("\t-live_stream_ref not initialized")
      end
    catch err: [error.json] do
      log("\t-Error trying to hangle data from API response: #{err}")
    end
  end
end

# This callback is the authentication function for the harbor mount
# It makes a POST request to the nextjs backend to check if the connecting
# user is the scheduled user. This means that password will be some unique
# identifier for a user and should NOT be shared
def auth(user)
  address = user.address
  username = user.user
  password = user.password

  log("Client #{username} at #{address} attempting to authenticate...")

  client_addr_ref := address

  url = "#{siteURL}/api/dj"
  body = "user=#{username}&pass=#{password}"

  resp = http.post.stream(
    data = body,
    headers = [("Content-Type", "application/x-www-form-urlencoded")],
    on_body_data=respDataCallback,
    url
  )

  log("\t-Authentication Response Status Code: #{resp.status_code}, Message: #{resp.status_message}")

  if resp.status_code == 200 then
    log("\t-Authentication Success.")
    true
  else
    log("\t-Authentication Failed.")
    false
  end
end

def harborConnectCallback(headers)
  if null.defined(client_addr_ref()) then
    log("Client at #{ null.get(client_addr_ref()) } Connected.")
  else
    log("Client Connected")
  end

  list.iter(fun (x) -> log("\t-#{fst(x)} : #{snd(x)}"), headers)

  one_hour = 1. * 60. * 60.
  allowed_duration = client_timelimit_ref() ?? one_hour

  log("Client is limited to a #{allowed_duration} second stream.")

  # Run a thread that will call the command to disconnect the client
  # after allowed_duration seconds.
  thread.run(
    delay=allowed_duration,
    fun () -> (
      ignore(server.execute("live_dj.stop_dj"))
    )
  )
end

def harborDisconnectCallback()
if disconnect_called_ref() then
    log("Disconnect already handled. Ignoring.")
  else
    disconnect_called_ref := true

    if null.defined(client_addr_ref()) then
      log("Client at #{ null.get(client_addr_ref()) } Disconnected.")
    else
      log("Client Disconnected")
    end

    ignore(server.execute("live_dj.log_status"))
  end

end

def harborShutdownCallback()
  log("Shutdown callback called.")
end

# Set up live stream with auth
base_stream = input.harbor(
  harborMount,
  id="live_dj",
  port=harborPort,
  password=harborPassword,
  buffer=5.0,
  max=20.0,
  auth=auth,
  on_connect=harborConnectCallback,
  on_disconnect=harborDisconnectCallback,
)

base_stream.on_shutdown(harborShutdownCallback)

# Register a command to forcibly disconnect client
base_stream.register_command(
  description="Force-disconnect the current live DJ",
  "stop_dj",
  fun (_) -> (
    if base_stream.is_active() then
      log("Force stopping live DJ via command.")
      base_stream.stop();
      "Live DJ stopped."
    else
      "No DJ connected."
    end
  )
)

# Register a command to log the status of the server
base_stream.register_command(
  description="Log the status of the current stream",
  "log_status",
  fun (_) -> (
    if true then
      msg = (
        "Stream status: #{base_stream.status()}" ^
        "\n\t- active: #{base_stream.is_active()}" ^
        "\n\t- ready: #{base_stream.is_ready()}" ^
        "\n\t- up: #{base_stream.is_up()}\n"
      )

      log(msg)
      "Stream logged."
    else
      "Stream not logged."
    end
  )
)

# Wrap the stream to support metadata injection
meta_stream = insert_metadata(base_stream)

# Save a ref to the source stream to use in callbacks
live_stream_ref := meta_stream

# Output to Icecast Server
output.icecast(%mp3(bitrate=320),
  host=host,
  port=port,
  password=password,
  mount=mount,
  name=name,
  fallible=true, # Right now the stream can go down
  meta_stream
)