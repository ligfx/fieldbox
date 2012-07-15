class FindPerson
  def call(id)
    users = [
      {
        id: 'michael',
        name: "Michael",
        token: "hpv6k72rbqzt38e",
        secret: "bm05x8olrjv6r51",
      },
      {
        id: 'hugh',
        name: "Hugh",
        token: "umxlnqc8lb9lpsi",
        secret: "lowb8lvqnyydie0",
      },
    ]
    users.find { |u| u[:id] == id.to_s }
  end
end