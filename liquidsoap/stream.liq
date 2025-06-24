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

# Set up output file
output.file(
  %mp3(bitrate=320, stereo_mode="joint_stereo", internal_quality=0, id3v2=true),
  on_start = fun() -> begin
    log(level=3, label="outfile.on_start", "Started Recording to #{radioshow.temp_filename}...")
    live_stream_active := true
  end,
  on_close = fun(_) -> begin
    log(level=3, label="outfile.on_close", "Stopped Recording to #{radioshow.temp_filename}.")

    thread.run(
      delay=0.,
      fun () -> begin
        try
          userId = list.assoc("userId", meta_ref())
          streamScheduleId = list.assoc("streamScheduleId", meta_ref())
          streamInstanceId = list.assoc("streamInstanceId", meta_ref())

          filePath = "/app/files/archive-#{userId}-#{streamScheduleId}-#{streamInstanceId}.mp3"

          file.copy(radioshow.temp_filename, filePath)
          log(level=3, label="outfile.on_close", "\t- Copied #{radioshow.temp_filename} file to #{filePath}.")

          # Make the HTTP POST file upload call
          let response = http.post.file(
            file=filePath,
            name="file",
            filename="archive.mp3",
            content_type="audio/mpeg",
            headers=[("Authorization", "Bearer secretToken"),
                    ("userId", userId),
                    ("streamScheduleId", streamScheduleId),
                    ("streamInstanceId", streamInstanceId)],
            "#{radioshow.url}/api/archive-upload"
          )

          log(level=3, label="outfile.on_close", "\t- Upload status: #{response.status_code} #{response.status_message}")
          log(level=3, label="outfile.on_close", "\t- Upload response body: #{response}")

          meta_ref := []

        catch err do
          log(level=1, label="outfile.on_close", "Error in on_close thread: #{err}")
        end
      end
    )
  end,
  fallible=true,
  radioshow.temp_filename,
  base_stream
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
    ignore(radioshow.post(
      timeout=5.0,
      "stream_status",
      json.stringify("live")
    ))
  end,
  on_stop= fun() -> begin
    log(
      level=2,
      label="icecast.on_stop",
      "Icecast output has stopped."
    )

    ignore(radioshow.post(
      timeout=5.0,
      "stream_status",
      json.stringify("offline")
    ))
    end,
  base_stream
)