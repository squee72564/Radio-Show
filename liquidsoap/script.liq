host = environment.get("ICECAST_HOST", default="icecast")
port = int_of_string(environment.get("ICECAST_PORT", default="8000"))
password = environment.get("ICECAST_PASSWORD", default="hackme")
mount = environment.get("ICECAST_MOUNT", default="live")
name = environment.get("ICECAST_NAME", default="radio show")
output.icecast(%mp3,
  host=host,
  port=port,
  password=password,
  mount=mount,
  name=name,
  sine()
)