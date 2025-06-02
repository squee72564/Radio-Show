# Define the sine wave source
sine_wave = sine()

# Send it to Icecast
output.icecast(%mp3,
  host = "icecast",  # Docker service name
  port = 8000,
  password = "hackme",  # Match Icecast's source-password
  mount = "live",
  name = "My Stream"
, sine_wave)