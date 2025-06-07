
def harbor_connect_callback(headers)
  live_stream_active := true
  disconnect_called_ref := false

  if null.defined(client_addr_ref()) then
    log(
      level=2,
      label="harbor_connect_callback",
      "Client at #{ null.get(client_addr_ref()) } Connected."
    )
  else
    log(
      level=2,
      label="harbor_connect_callback",
      "Client Connected."
    )
  end

  list.iter(
    fun (x) -> begin
      log(
        level=2,
        label="harbor_connect_callback","\t-#{fst(x)} : #{snd(x)}"
      )
    end,
    headers
  )

  ignore(server.execute("live_dj.log_status"))
end

def harbor_disconnect_callback()
  if disconnect_called_ref() then
    log(
      level=2,
      label="harbor_disconnect_callback",
      "Disconnect already handled. Ignoring."
    )
    ()
  else
    if null.defined(client_addr_ref()) then
      log(
        level=2,
        label="harbor_disconnect_callback",
        "Client at #{ null.get(client_addr_ref()) } Disconnected."
      )
    else
      log(
        level=2,
        label="harbor_disconnect_callback",
        "Client Disconnected."
      )
    end
    
    # Clean up data tracking live user
    # Maybe add variable for sanity checks if live
    # Add function to write 
    disconnect_called_ref := true
    client_addr_ref := null()

    ignore(server.execute("live_dj.log_status"))
  end
end