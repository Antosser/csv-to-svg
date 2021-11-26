(function(){
	var download = (filename, text) => {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}
	$("#submit").click(() => {
		let ignorefirst = $("#ignorefirst")[0].checked;
		let ignoredcolumns = $("#ignorecol").val().split(" ");
		let reader = new FileReader();

		for (let i = 0; i < ignoredcolumns.length; i++) {
			ignoredcolumns[i] = parseInt(ignoredcolumns[i]);
		}

		reader.onload = () => {
			const lines = reader.result.split("\n").map(line => {
				return  line.split(",");
			});
			console.log(lines);
			let max = 0;
			for (let i = ignoredcolumns ? 1 : 0; i < lines.length; i++)
				for (let j = 0; j < lines[i].length; j++)
					if (parseInt(lines[i][j]) > max && !ignoredcolumns.includes(j))
						max = parseInt(lines[i][j]);
			console.log("Max:", max)
			let svg = '<svg width="1600" height="800" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
			let xdim = lines[0].length;
			let ydim = lines.length;
			for (let i = 0; i < xdim; i++) {
				if (ignoredcolumns.includes(i))
					continue;
				svg += '<polyline stroke="red" stroke-width="1" fill="none" points="';
				for (let j = ignoredcolumns ? 1 : 0; j < ydim; j += ydim >= 10000 ? parseInt(ydim / 10000) : 1) {
					svg += j / lines.length * 1600;
					svg += ",";
					svg += 800 - parseInt(lines[j][i]) / max * 800;
					svg += " ";
				}
				svg += '" />';	
			}
			svg += '</svg>';
			download("result.svg", svg)
		}

		reader.readAsText($("#file")[0].files[0]);
	});
})();