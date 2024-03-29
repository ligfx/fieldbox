require './application'
Newsdrop::Application.initialize!

if Newsdrop::Application.env == 'development'
  use AsyncRack::CommonLogger

  # Enable code reloading on every request
  use Rack::Reloader, 0
end

# Serve assets from /public
use Rack::Static, :urls => ["/assets"], :root => Newsdrop::Application.root(:public)

# Running thin :
#
#   bundle exec thin --max-persistent-conns 1024 --timeout 0 -R config.ru start
#
# Vebose mode :
#
#   Very useful when you want to view all the data being sent/received by thin
#
#   bundle exec thin --max-persistent-conns 1024 --timeout 0 -V -R config.ru start
#

run Newsdrop::Application.routes
