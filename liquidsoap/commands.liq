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
  fun (_) -> begin
    log(
      level=3,
      label="live_dj.log_status",
      "Stream status:\n" ^
      "\t- #{base_stream.status()}\n" ^
      "\t- id: #{base_stream.id()}\n" ^
      "\t- buffer_len: #{base_stream.buffer_length()}\n" ^
      "\t- time: #{base_stream.time()}\n" ^
      "\t- self_sync: #{base_stream.self_sync()}\n" ^
      "\t- is_active: #{base_stream.is_active()}\n" ^
      "\t- is_ready: #{base_stream.is_ready()}\n" ^
      "\t- is_up: #{base_stream.is_up()}"
    )
    "Logged"
  end
)