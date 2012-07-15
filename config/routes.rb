# Check out https://github.com/joshbuddy/http_router for more information on HttpRouter
HttpRouter.new do
  add('/').to(IndexAction)
  add('/people/:id.json').to(GetPersonDataAction)
  add('/people/:id/photos.json').to(GetPhotosAction)
end
