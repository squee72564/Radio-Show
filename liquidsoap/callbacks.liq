
def harbor_connect_callback(headers)
  live_stream_active := true
  disconnect_called_ref := false

  log(
    level=2,
    label="harbor_connect_callback",
    "Client at #{ client_addr_ref() } Connected."
  )

  list.iter(
    fun (x) -> begin
      log(
        level=2,
        label="harbor_connect_callback","\t-#{fst(x)} : #{snd(x)}"
      )
    end,
    headers
  )

  # Disconnect input.harbor after allotted time with 30s extra window
  thread.run(
    delay=timeout_ref() + 30.,
    fun () -> (
      ignore(server.execute("live_dj.stop_dj"))
    )
  )

  ignore(server.execute("live_dj.log_status"))
end

def harbor_disconnect_callback()
  # if disconnect_called_ref() then
  #   log(
  #     level=2,
  #     label="harbor_disconnect_callback",
  #     "Disconnect already handled. Ignoring."
  #   )
  #   ()
  # else
    log(
      level=2,
      label="harbor_disconnect_callback",
      "Client at #{ client_addr_ref() } Disconnected."
    )
    
    # Clean up data tracking live user
    # Maybe add variable for sanity checks if live
    # Add function to write 
    disconnect_called_ref := true
    client_addr_ref := "None"
    live_stream_active := false

    ignore(server.execute("live_dj.log_status"))
  # end
end