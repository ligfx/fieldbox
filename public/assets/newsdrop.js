Newsdrop = {};
(function() {
var cbs = [];
Newsdrop.onImageClicked = function(cb) {
  cbs.push(cb);
};
Newsdrop.imageClicked = function(path) {
  cbs.forEach(function(c) { c(path); })
}
})();
Newsdrop.Views = {};
Newsdrop.Views.index = {
  init: function() {
    $("#newsdrop-view-index .person").each(function() {
      var self = $(this);
      var id = self.data("person-id");
      var name = self.data("person-name");
      self.find("a").click(function() {
        Newsdrop.Views.index.clean();
        Newsdrop.Views.photos.update(id);
        return false;
      });
    })
  },
  update: function() {
    $("#newsdrop-view-index").show();

    var promise = (function(){
      var started = false;
      var value = 0;
      var handler;
      return {
        decrement: function() {
          value--;
          if (0 == value && handler) {
            handler();
          }
        },
        increment: function() {
          value++;
          started = true;
        },
        wait: function (cb) {
          if (0 == value && started) {
            cb();
          } else {
            handler = cb;
          }
        }
      }
    })();

    var recent = [];
    promise.wait(function() {
      console.log(recent);
      _.sortBy(recent, function(photo) { return - new Date(photo.mtime).getTime(); })
      .slice(0, 12).forEach(function(photo) {
        $("#newsdrop-view-index .loading").remove();
        var box = $("<div class=\"small-photo-box\"><div class=\"overlay\"></div></div>");
        $("#newsdrop-view-index #newsdrop-latest-photos").append(box);
        var img = new Image();
        $(img).load(function(){
          if (this.height < this.width) {
            $(img).css("height", "100px");
          } else {
            $(img).css("width", "100px");
          }
          box.append(img);
          box.click(function() {
            Newsdrop.imageClicked("//electric-mist-7784.herokuapp.com/" + photo.person + photo.path);
          })
        })
        img.src = "//electric-mist-7784.herokuapp.com/" + photo.person + photo.path;
      })
    })

    $("#newsdrop-view-index .person").each(function() {
      promise.increment();
      var self = $(this);
      var id = self.data("person-id");
      $.getJSON("/people/" + id + ".json")
      .success(function(data) {
        self.find(".column-files").text(data.photos);
        self.find(".column-mtime").text(data.mtime || "-");
        recent = recent.concat(data.recent.map(function(d) {
          d.person = id;
          return d;
        }));
        promise.decrement();
      })
      .error(function() {
        self.find(".column-files").text("-");
        self.find(".column-mtime").text("-");
        promise.decrement();
      });
    })
  },
  clean: function() {
    $("#newsdrop-view-index").hide();
    $("#newsdrop-view-index #newsdrop-latest-photos").children().remove();
  }
}
Newsdrop.Views.photos = {
  init: function() {
    $("#newsdrop-view-photos .index-link").click(function(){
      Newsdrop.Views.photos.clean();
      Newsdrop.Views.index.update();
      return false;
    })
  },
  update: function(id) {
    var person = Newsdrop.people.filter(function(p) { return p.id == id; })[0];
    $("#newsdrop-view-photos").show();

    $("#newsdrop-view-photos .breadcrumb-name").text(person.name);

    $("#newsdrop-breadcrumb-sprite").attr("src", person.avatar);

    $.getJSON("/people/" + id + "/photos.json")
    .success(function(data) {
      $(".loading").remove();
      var lazy = data.map(function(photo) {
        var box = $("<div class=\"photo-box\"><div class=\"overlay\"></div></div>");
        $("#newsdrop-view-photos #newsdrop-data").append(box);

        return [box, photo];
      });

      $(window).scroll(_.debounce(function() {
        lazy = lazy.filter(function(boxphoto) {
          var box = boxphoto[0];
          var photo = boxphoto[1];

          if (!box.is(":visible")) {
            return;
          }

          if (isScrolledIntoView(box)) {
            var img = new Image();
            $(img).load(function(){
              if (this.height < this.width) {
                $(img).css("height", "128px");
              } else {
                $(img).css("width", "128px");
              }
              box.append(img);
              box.click(function() {
                Newsdrop.imageClicked("//electric-mist-7784.herokuapp.com/" + id + photo);
              })
            })
            img.src = "//electric-mist-7784.herokuapp.com/" + id + photo;
            return false;
          } else {
            return true;
          }
        })
      }, 500));
      $(window).scroll();
    })
    .error(function() {
      $(".loading").text("Error");
    });
  },
  clean: function() {
    $(window).off("scroll");
    $("#newsdrop-view-photos #newsdrop-data").html("<div class=\"loading\">Loading...</div>");
    $("#newsdrop-view-photos").hide();
  }
}

Newsdrop.people = [
        {name: "Michael Maltese", id: "michael", avatar: "http://avatars.io/facebook/michael.maltese" },
        {name: "Hugh Berryman", id:"hugh", avatar: "http://avatars.io/facebook/Hugh.G.Berryman" },
        {name: "Joseph Pulitzer", id:"joseph", avatar: "http://upload.wikimedia.org/wikipedia/commons/4/49/JosephPulitzerPinceNeznpsgov.jpg"},
    ]

Newsdrop.init = function(target) {
  $.get("/assets/newsdrop.mustache")
  .success(function(template) {

  var html = Mustache.to_html(template, {
    people: Newsdrop.people
  });
  $(target).html(html);

  Newsdrop.Views.index.init();
  Newsdrop.Views.photos.init();
  Newsdrop.Views.index.update();

  })
  .error(function() {
    $(target).html("Something broke!");
  })
};

function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom >= docViewTop) && (elemBottom <= docViewBottom)) ||
    ((elemTop >= docViewTop) && (elemTop <= docViewBottom));
}