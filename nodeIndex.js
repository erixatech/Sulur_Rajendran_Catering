var http = require('http');
var fs = require('fs');
var jsdom = require("jsdom");
const {JSDOM} = jsdom;

http.createServer(function (req, res) {
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(parseData(data));
    res.end();
  });
}).listen(8093);

function parseData(html)
{
	//$('#id_testForm').html(testJs.testFn($));
	//testJs1.testFn1($);
	//var testJson = {"name" : "123"};
	//var mongoOpns = require('./mongoQueries');
	//mongoOpns.mongoOpns("receipe", "insert", testJson);
    const dom = new JSDOM(html);
    global.jQuery = global.$ = (require('jquery'))(dom.window); 
    global.document = dom.window.document;
    global.ingredientCategories = ["Maligai", "KaaiKanigal", "Extras", "Suppliments"];
    //var bootstrap = require('bootstrap');
    require('bootstrap');
    require("bootstrap-loader");
    const Window = require('window');
    const window = new Window();
    var baseHtml = require('./indexJs');
    $('#id_nodeWrapper').html(baseHtml.getBaseHtml());

    var OrderTab1 = require('./js/order-tab');
    var orderCall = OrderTab1.OrderTab;
    var newOrder = new orderCall($);

    var RecipeTab1 = require('./js/recipe-tab');
    var receipeCall = RecipeTab1.RecipeTab;
    var newReceipe = new receipeCall();

    var IngredientTab1 = require('./js/ingredient-tab');
    var ingredientCall = IngredientTab1.IngredientTab;
    var newIngredient = new ingredientCall();

	return $('#id_nodeWrapper').html();
}