# Set up live stream with auth
base_stream = input.harbor(
  radioshow.harbor_mount,
  id="live_dj",
  port=radioshow.harbor_port,
  password=radioshow.harbor_password,
  buffer=10.0,
  max=20.0,
  auth=radioshow.auth_callback,
  on_connect=harbor_connect_callback,
  on_disconnect=harbor_disconnect_callback,
)

# Set up output file
outfile = output.file(
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
    file.copy(radioshow.temp_filename, "/app/archive.mp3")
    log(level=3, label="outfile.on_close", "\t- Copied #{radioshow.temp_filename} file to /app/archive.mp3.")
  end,
  fallible=true,
  radioshow.temp_filename,
  base_stream
)

# Wrap the stream to support metadata injection
meta_wrapped = insert_metadata(base_stream)

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
  on_start= fun() -> begin
    log(
      level=2,
      label="icecast.on_start",
      "Started Icecast output."
    )
    mm = current_meta()

    def allowed_duration = 
      if mm["timelimit"] != "" then
        float_of_string(mm["timelimit"])
      else
        1. * 60. * 60. # 1 hour default
      end
    end

    log(
      level=2,
      label="icecast.on_start",
      "\t- Client is limited to a #{allowed_duration} second stream."
    )

    # Run a thread that will call the command to disconnect the client
    thread.run(
      delay=allowed_duration,
      fun () -> begin
        ignore(server.execute("live_dj.stop_dj"))
      end
    )
  end,
  on_stop= fun() -> begin
    log(
      level=2,
      label="icecast.on_stop",
      "Stopped Icecast output."
    )

    live_stream_active := false
  end,
  meta_wrapped
)