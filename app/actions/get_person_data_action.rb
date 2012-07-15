class GetPersonDataAction < Cramp::Action
  def respond_with
  	person = FindPerson.new.call(params[:id])
  	halt 404 if person.nil?
  	@data = GetPersonData.new.call person
  	[200, {"Content-Type"=>"text/html"}]
  rescue DropboxError
  	halt 502
  end
  def start
 	  render JSON.dump @data
    finish
  end
end
