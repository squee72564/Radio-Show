let radioshow = ()

# <-----
# Icecast Env Vars
# -----> #
let radioshow.icecast_host      = environment.get("ICECAST_HOST", default="icecast")
let radioshow.icecast_port      = int_of_string(environment.get("ICECAST_PORT", default="8000"))
let radioshow.icecast_password  = environment.get("ICECAST_PASSWORD", default="hackme")
let radioshow.icecast_mount     = environment.get("ICECAST_MOUNT", default="live")
let radioshow.icecast_name      = environment.get("ICECAST_NAME", default="radio show")


# <-----
# Harbor Input Env Vars
# -----> #
let radioshow.harbor_password   = environment.get("HARBOR_PASSWORD", default="securepassword")
let radioshow.harbor_port       = int_of_string(environment.get("HARBOR_PORT", default="8005"))
let radioshow.harbor_mount      = environment.get("HARBOR_MOUNT", default="/dj")


let radioshow.url = environment.get("SITE_URL", default="http://host.docker.internal:3000")


# <-----
# Global References
# -----> #

current_meta = ref(
  [
    ("title", "None"),
    ("genre", "None"),
    ("liq_remaining", "0.")
  ]
);

live_stream_ref = ref(null())       # Ref for livestream; used in callbacks declared before livestream defined

client_addr_ref = ref(null())       # Keeps track of client 
client_timelimit_ref = ref(null())  # Keeps track of client timelimit

disconnect_called_ref = ref(false)  # Keeps track of if disconnect callback was called