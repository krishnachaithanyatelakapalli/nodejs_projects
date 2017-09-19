function acquire(){
	items 			= 	document.querySelectorAll("#item");
	select_btns 	= 	document.querySelectorAll("#select-btn");
	cart_display 	= 	document.querySelector("#cart");
	menu 			= 	document.querySelector("#menu");
	cart_list 		= 	document.querySelector("#cart_list");
	row 			= 	document.querySelector("#outer_row");
	remove_btns		= 	document.querySelectorAll("#remove_item");
}

function data_init(){
	list = [];	
}

function disp_cart(){
	var disp = "";
	list.forEach(function(cart_item){
		disp += "<div>" + 
				"<li>" +
				"<h5 class='inline-view'><strong>" + cart_item.item_name + "</strong></h5>" + 
				"<p class='inline-view'> x " + cart_item.quantity + "</p>" +
				"<button class='pull-right' id='remove_item'>X</button>" +
				"</li>" +
				"</div>";
	});	
	cart_list.innerHTML = disp;
}

function remove_btn_init(){
	acquire();	
	remove_btns.forEach(function(remove_btn){
		remove_btn.addEventListener("click", function(){			
			var text = this.parentElement.querySelector("h5").textContent;
			list.forEach(function(cart_item){
				if(cart_item.item_name === text){
					list.splice(list.indexOf(cart_item),1);
				}
			})
			// list.pop(this.parentElement.querySelector("h5").textContent);
			console.log(list);
			disp_cart();
			acquire();
		});
	});	
}

function init(){
	acquire();
	data_init();
	cart_display.style.display = "none";	
	row.style.margin = "0 0";
}

var items,
	select_btns,
	cart_display,
	menu,
	cart_list,
	row,
	list,
	remove_btns;

init();

items.forEach(function(item){	
	var count 	= 0;	
	var plus 	= item.querySelector("#plus");
	var minus 	= item.querySelector("#minus");
	var sel_btn = item.querySelector("#select-btn");
		
	var num_disp = item.querySelector("#select-num");
	plus.addEventListener("click", function(){
		count += 1;
		num_disp.textContent = count;
		sel_btn.style.display = "inline-block";
	});

	minus.addEventListener("click", function(){
		if(count > 0){
			count -= 1;
			num_disp.textContent = count;	
		} 
		if(count === 0){
			sel_btn.style.display = "none";
		}
	});
			
	num_disp.textContent = count;	
});

select_btns.forEach(function(select_btn){
	select_btn.style.display = "none";
	select_btn.addEventListener("click", function(){
		menu.setAttribute("class", "col-lg-10");
		cart_display.style.display = "block";			
		
		var num_disp = select_btn.parentElement.querySelector("#select-num").textContent;
		var item_name = select_btn.parentElement.querySelector("#item_name").textContent;

		var selection = {
			"item_name": item_name,
			"quantity": num_disp
		}
		
		list.push(selection);
		disp_cart();
		remove_btn_init();	
	});
});

// menu_btn.addEventListener("click", function(){
// 	menu_btn.classList.add("active");
// 	console.log(menu_btn);
// });