# Register a command to forcibly disconnect client
base_stream.register_command(
  description="Force-disconnect the current live DJ",
  "stop_dj",
  fun (_) -> begin
    log(
      level=3,
      label="live_dj.stop_dj",
      "Force stopping live DJ! - Timelimit Exceeded"
    )
    base_stream.stop();
    "Live DJ stopped."
  end
)

# Register a command to log the status of the server
base_stream.register_command(
  description="Log the status of the current stream",
  "log_status",
  fun (_) -> begin
    log(
      level=3,
      label="live_dj.log_status",
      "Stream status: #{base_stream.status()}\n" ^
      "\t- active: #{base_stream.is_active()}\n" ^
      "\t- ready: #{base_stream.is_ready()}\n" ^
      "\t- up: #{base_stream.is_up()}"
    )
    "Logged"
  end
)