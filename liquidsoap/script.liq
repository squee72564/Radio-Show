%include "./utils.liq"

radioshow.log_env_vars()

# Set up live stream with auth
base_stream = input.harbor(
  radioshow.harbor_mount,
  id="live_dj",
  port=radioshow.harbor_port,
  password=radioshow.harbor_password,
  buffer=5.0,
  max=20.0,
  auth=radioshow.auth_callback,
  on_connect=harborConnectCallback,
  on_disconnect=harborDisconnectCallback,
)

base_stream.on_wake_up(fun() -> log("input.harbor node woke up!"))

# Register a command to forcibly disconnect client
base_stream.register_command(
  description="Force-disconnect the current live DJ",
  "stop_dj",
  fun (_) -> (
    if base_stream.is_active() then
      log(
        level=3,
        label="live_dj.stop_dj",
        "Force stopping live DJ!"
      )
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
      log(
        level=3,
        label="live_dj.log_status",
        "Stream status: #{base_stream.status()}" ^
        "\n\t- active: #{base_stream.is_active()}" ^
        "\n\t- ready: #{base_stream.is_ready()}" ^
        "\n\t- up: #{base_stream.is_up()}\n"
      )
      "Logged"
    else
      ""
    end
  )
)

# Wrap the stream to support metadata injection
meta_wrapped = insert_metadata(base_stream)

meta_wrapped.on_wake_up(fun() -> log("insert_metadata node woke up!"))

# Save a ref to the source stream to use in callbacks
live_stream_ref := meta_wrapped

# Output to Icecast Server
output.icecast(%mp3(bitrate=320),
  host=radioshow.icecast_host,
  port=radioshow.icecast_port,
  password=radioshow.icecast_password,
  mount=radioshow.icecast_mount,
  name=radioshow.icecast_name,
  fallible=true,
  meta_wrapped
)