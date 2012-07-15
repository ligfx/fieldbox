class IndexAction < Cramp::Action
  def start
  	render File.read Newsdrop::Application.root(File.join("app/views/index.html"))
    finish
  end
end
