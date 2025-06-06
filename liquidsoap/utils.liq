
%include "./globals.liq"

def radioshow.log_env_vars() =
  log(level=3, label="env.info", "ENVIRONMENT INFO:")
  list.iter(fun (x) -> log(level=3, label="env.info", "\t${#{fst(x)}} = #{snd(x)}"), environment())
end

def radioshow.post(~timeout=10., url, payload) =
  full_url =  "#{radioshow.url}/api/#{url}"

  log(
    level=3,
    label="radioshow.post",
    "API #{url} - Sending POST request to '#{full_url}' with body: #{payload}"
  )

  try
    response = http.post(full_url,
      headers=[
        ("Content-Type", "application/json"),
        ("User-Agent", "Liquidsoap Radio Show")
      ],
      timeout=timeout,
      data=payload
    )

    log(
      level=3,
      label="radioshow.post",
      "\t- API #{url} - Response (#{response.status_code}): #{response}"
    )

    if response.status_code != 200 then
      null()
    else
      "#{response}"
    end
  catch err do
    log(
      level=2,
      label="radioshow.post",
      "\t- API #{url} - Error: #{error.kind(err)} - #{error.message(err)}"
    )
    
    null()
  end
end

# This callback is the authentication function for the harbor mount
# It makes a POST request to the nextjs backend to check if the connecting
# user is the scheduled user. This means that password will be some unique
# identifier for a user and should NOT be shared
def radioshow.auth_callback(auth_info)
  log(
    level=3,
    label="radioshow.auth_callback",
    "Client #{auth_info.user} at #{auth_info.address} attempting to authenticate..."
  )

  client_addr_ref := auth_info.address

  try
    auth_response = radioshow.post(
      timeout=5.0,
      "dj",
      json.stringify(auth_info)
    );

    if null.defined(auth_response) then
      let json.parse (
        {
          authenticated,
          meta = {
            title,
            user,
            timelimit
          }
        } : {
          authenticated : bool,
          meta: {
            title: string,
            user: string,
            timelimit: float
          },
        }
      ) = null.get(auth_response)

      if authenticated then
        client_timelimit_ref := timelimit

        current_meta := [
          ("title", title),
          ("artist", user),
          ("liq_remaining", "#{client_timelimit_ref()}")
        ]

        if null.defined(live_stream_ref()) then
          null.get(live_stream_ref()).insert_metadata(current_meta())
        else
          log(
            level=3,
            label="radioshow.auth_callback",
            "\t-live_stream_ref not initialized"
          )        
        end
        true
      else
        false
      end
    else
      false
    end
  catch err do 
    log(
      level=1,
      label="radioshow.auth_callback",
      "ERROR parsing JSON: #{err}"
    )
    false
  end
end


def harborConnectCallback(headers)
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
    fun (x) -> (
      log(
        level=2,
        label="harbor_connect_callback","\t-#{fst(x)} : #{snd(x)}"
      )
    ),
    headers
  )

  one_hour = 1. * 60. * 60.
  allowed_duration = client_timelimit_ref() ?? one_hour

  log(
    level=2,
    label="harbor_connect_callback",
    "Client is limited to a #{allowed_duration} second stream."
  )

  disconnect_called_ref := false
  server.execute("live_dj.log_status")

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
    log(
      level=2,
      label="harbor_disconnect_callback",
      "Disconnect already handled. Ignoring."
    )
    ()
  else
    disconnect_called_ref := true

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

    server.execute("live_dj.log_status")
    ()
  end
end