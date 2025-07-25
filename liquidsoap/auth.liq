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

  if not live_stream_active() then
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
              timelimit,
              userId,
              streamScheduleId,
              streamInstanceId
            }
          } : {
            authenticated : bool,
            meta: {
              title: string,
              timelimit: float,
              userId: string,
              streamScheduleId: string,
              streamInstanceId: string
            },
          }
        ) = null.get(auth_response)

        if authenticated then
          meta_ref := [
            ("userId", userId),
            ("streamScheduleId", streamScheduleId),
            ("streamInstanceId", streamInstanceId),
            ("title", title)
          ]

          timeout_ref := timelimit
          
          client_addr_ref := auth_info.address
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
  else
    log(
      level=3,
      label="radioshow.auth_callback",
      "\t- Live stream still recording, auth failed"
    )
    false
  end
end
