def radioshow.log_env_vars() =
  log(level=3, label="env.info", "ENVIRONMENT INFO:")
  list.iter(
    fun (x) -> begin
      log(level=3, label="env.info", "\t${#{fst(x)}} = #{snd(x)}")
    end,
    environment()
  )
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