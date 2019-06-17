var mysql =require('mysql')
var table = require('console.table');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
  });
  
   connection.connect (function(err) {
    if (err) throw err;
    //console.log("Connected!");
 settingItems();
  });
  function settingItems()
  {
      connection.query("SELECT item_id, product_name, price, stock_quantity  FROM products WHERE stock_quantity >0", function (err, res) {
        if (err) throw err;
        console.table(res);
        sellingItem();
      });
    }

    function sellingItem()
    {
     inquirer .prompt ([
         {
             name: "id",
             type: "input",
             message: "what is the id of the products you would like to buy?"
         },
         {
            name: "quantity",
            type: "input",
            message: "how many units of the products you would like to buy?"
        }
        
  ])
  .then(answers => {
    connection.query("SELECT item_id, product_name, price, stock_quantity  FROM products WHERE item_id =?",
    // Use user feedback for... whatever!!
    [answers .id],
    function(err,res){
      if (err)throw err;

      var idHolder = answers.id;
      var quantityHolder = answers.quantity;
      //console.log(answers);
      //console.log(res)
      var itemHolder = res[0];
      stock(quantityHolder,itemHolder);
    })
  });

    }
    function stock(quantityHolder, itemHolder){
        // step 7
      //console.log("made it in");
      if (parseInt( quantityHolder) <= itemHolder.stock_quantity  ) 
      {

        processOrder(itemHolder,quantityHolder);
      }
      else 
      {
        console.log("insufficient quantity!");
      }
      //console.log("user is asking for " + + ")
      //if(itemSelection  in stock)
    }
    function processOrder (itemHolder, quantityHolder) {
      //decrease the stock quantity by the amount they buy
      var theAmountLeftStock = itemHolder.stock_quantity - parseInt( quantityHolder);

        console.log(theAmountLeftStock);


        connection.query("UPDATE products set ? WHERE ?", [{
          stock_quantity: theAmountLeftStock
        } ,{
          item_id:itemHolder.item_id
        }],
        function(err){
          if (err) throw err;
          var totalHolder =  itemHolder .price * parseInt (quantityHolder);//price *quantity

          console.log( "your total is $" +totalHolder);
          settingItems();
        }
        );
    }