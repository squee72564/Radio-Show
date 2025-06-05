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
current_meta = ref([("title", "None"), ("genre", "None")])
live_stream_ref = ref(null())

# This callback captures the response data from the authentication
# POST request and attaches related metadata like artist and title
def respDataCallback(dataOpt)
  dataJsonString = dataOpt ?? "{}"

  if dataJsonString != "{}" then
    try
      let json.parse ( dataJson : {
        authenticated : bool,
        meta: {
          title: string,
          user: string
        }
      }) = dataJsonString

      current_meta := [
        ("title", dataJson.meta.title),
        ("artist", dataJson.meta.user)
      ]

      if null.defined(live_stream_ref()) then
        null.get(live_stream_ref()).insert_metadata(current_meta())
      else
        log("live_stream_ref not initialized")
      end
    catch err: [error.json] do
      log("Error trying to hangle data from API response: #{err}")
    end
  end
end

# This callback is the authentication function for the harbor mount
# It makes a POST request to the nextjs backend to check if the connecting
# user is the scheduled user. This means that password will be some unique
# identifier for a user and should NOT be shared
def auth(user)
  username = user.user
  password = user.password

  url = "#{siteURL}/api/dj"
  body = "user=#{username}&pass=#{password}"

  resp = http.post.stream(
    data = body,
    headers = [("Content-Type", "application/x-www-form-urlencoded")],
    on_body_data=respDataCallback,
    url
  )

  log("Response Status Code: #{resp.status_code}, Message: #{resp.status_message}")

  resp.status_code == 200
end

# Set up live stream with auth
base_stream = input.harbor(
  harborMount,
  port=harborPort,
  password=harborPassword,
  buffer=5.0,
  max=10.0,
  auth=auth
)

# Wrap the stream to support metadata injection
meta_stream = insert_metadata(base_stream)
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