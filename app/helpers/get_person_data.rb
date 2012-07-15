require 'time'

class GetPersonData
	def call(person)
		photos = GetPersonPhotos.new.call(person)
		sorted_photos = photos.sort_by { |p| Time.parse p['client_mtime'] }
		last_upload = sorted_photos.last
		if last_upload
			last_upload = Time.parse(last_upload['client_mtime']).strftime("%l:%M %p")
		end
		recent = sorted_photos.reverse.take(12).map do |p|
			{mtime: p['client_mtime'], path: p['path'] }
		end
		return {
			photos: photos.size,
			mtime: last_upload,
			recent: recent
		}
	end
end