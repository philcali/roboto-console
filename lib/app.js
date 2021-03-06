$(function() {
  var roboto = new RobotoApp(new RobotoAPI());
  roboto.attemptLogin(location.search,
    function(error) {
      if (error) {
        roboto.loadError(error);
      } else if (roboto.isLoggedIn()) {
        roboto.loadInterface();
      } else {
        roboto.loadSignin();
      }
    });
  $('.year').text($('.year').text().replace('{year}', new Date().getFullYear()));
  $('.dropdown-button').dropdown();
});
