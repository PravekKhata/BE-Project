
var move_show_flag = false;
function deal_button() {
	var move_show_button = document.getElementById("move_show");	
	if (move_show_button) {
		move_show_button.onclick = function() {
			//alert(move_show_button);
			if (move_show_flag) {
				move_show_button.innerHTML="Show no";
				move_show_flag = false;
			} else {
				move_show_button.innerHTML="Showing";
				move_show_flag = true;
			}
			showPan();
		}
	}
}
addLoadEvent(deal_button);
