require 'json'

class GetPhotosAction < Cramp::Action
  def respond_with
  	person = FindPerson.new.call params[:id]
  	halt 404 if person.nil?
  	@photos = GetPersonPhotos.new.call(person).map do |photo|
  		photo['path']
  	end
  	[200, {'Content-Type' => "text/json"}]
  rescue DropboxError
  	halt 502
  end
  def start
  	render JSON.dump @photos
    finish
  end
end
