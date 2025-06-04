host = environment.get("ICECAST_HOST", default="icecast")
port = int_of_string(environment.get("ICECAST_PORT", default="8000"))
password = environment.get("ICECAST_PASSWORD", default="hackme")
mount = environment.get("ICECAST_MOUNT", default="live")
name = environment.get("ICECAST_NAME", default="radio show")

harborPassword = environment.get("HARBOR_PASSWORD", default="securepassword")
harborPort = int_of_string(environment.get("HARBOR_PORT", default="8005"))
harborMount = environment.get("HARBOR_MOUNT", default="/dj")

# Define an authentication function
def auth(user)
  username = user.user
  password = user.password

  cmd = "/app/check_user.sh " ^ string.quote(username) ^ " " ^ string.quote(password)
  result = process.run(cmd)

  log("Auth stdout: " ^ result.stdout)
  log("Auth stderr: " ^ result.stderr)
  log("Auth exit code: " ^ string(result.status.code))

  result.status == "exit" and result.status.code == 0
end

# Set up live stream with auth
live_stream = input.harbor(
  harborMount,
  port=harborPort,
  password=harborPassword,
  buffer=5.0,
  max=10.0,
  auth=auth
)

source = live_stream
source = fallback(track_sensitive=false, [source, blank()])

# Output to Icecast
output.icecast(%mp3,
  host=host,
  port=port,
  password=password,
  mount=mount,
  name=name,
  source
)
