# Set up live stream with auth
base_stream = input.harbor(
  radioshow.harbor_mount,
  id="live_dj",
  port=radioshow.harbor_port,
  password=radioshow.harbor_password,
  buffer=10.0,
  max=(1. * 60. * 60.),
  timeout=5.0,
  auth=radioshow.auth_callback,
  on_connect=harbor_connect_callback,
  on_disconnect=harbor_disconnect_callback,
)

# Wrap the stream to support metadata injection
meta_wrapped_stream = insert_metadata(base_stream)

# Save a reference to this stream to call insert_metadata in auth callback
meta_stream_ref := meta_wrapped_stream

# Set up output file
output.file(
  %mp3(bitrate=320, stereo_mode="joint_stereo", internal_quality=0, id3v2=true),
  on_start = fun() -> begin
    log(level=3, label="outfile.on_start", "Started Recording to #{radioshow.temp_filename}...")
    live_stream_active := true
  end,
  on_close = fun(_) -> begin
    log(level=3, label="outfile.on_close", "Stopped Recording to #{radioshow.temp_filename}.")
    # Again maybe do something with the file here - maybe run some process that
    # will copy it to a safe place and then send to the object storage, then
    # take care of deleting it?
    thread.run(
      delay=0.,
      fun () -> begin
        file.copy(radioshow.temp_filename, "/app/archive.mp3")
        log(level=3, label="outfile.on_close", "\t- Copied #{radioshow.temp_filename} file to /app/archive.mp3.")
      end
    )
  end,
  fallible=true,
  radioshow.temp_filename,
  meta_wrapped_stream
)

# Output to Icecast Server
output.icecast(%mp3(bitrate=320),
  host=radioshow.icecast_host,
  port=radioshow.icecast_port,
  password=radioshow.icecast_password,
  mount=radioshow.icecast_mount,
  name=radioshow.icecast_name,
  fallible=true,
  on_start= fun() -> begin
    log(
      level=2,
      label="icecast.on_start",
      "Started Icecast output has started."
    )
    radioshow.post(
      timeout=5.0,
      "stream_status",
      json.stringify("live")
    )
    ()
  end,
  on_stop= fun() -> begin
    log(
      level=2,
      label="icecast.on_stop",
      "Icecast output has stopped."
    )
    # Poll websocket here?
    radioshow.post(
      timeout=5.0,
      "stream_status",
      json.stringify("offline")
    )
    ()
    end,
  meta_wrapped_stream
)