class GetPersonPhotos
	def call(person)
		dropbox = DropboxForUser.new.call(person)
		uploads = dropbox.metadata("Camera Uploads")['contents']
		photos = uploads.select { |upload| upload['mime_type'] == "image/jpeg" }.reverse
		return photos
	end
end