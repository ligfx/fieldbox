class DropboxForUser
	def call(person)
		session = DropboxSession.new "f9nisuy95f4og6c", "m240yaenyk8z7a9"
		session.set_access_token person[:token], person[:secret]
		client = DropboxClient.new session, :dropbox
	end
end