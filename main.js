define(['base/js/namespace', 'base/js/events'], function (Jupyter, events) {
  
  // This function will detect the smells
  var findSmells = function () {

    let cell = Jupyter.notebook.get_selected_cell();
    let text = cell.get_text();

    // find the index of the currently selected cell
    let index = Jupyter.notebook.find_cell_index(cell);

    // get the cell elements
    let cell_elements = document.getElementsByClassName("CodeMirror-code");

    // get the HTML element for the current cell
    let element_array = cell_elements[index].getElementsByClassName("CodeMirror-line");
    let prompt = document.getElementsByClassName("prompt")[index];
    let func_script = document.createElement("script");
    func_script.innerHTML = "function myFunction() { var popup = document.getElementById(\"myPopup\"); popup.classList.toggle(\"show\"); div.remove()}"
    document.head.appendChild(func_script);
    // console.log(element_array);

    // function myFunction() {
    //   var popup = document.getElementById("myPopup");
    //   popup.classList.toggle("show");
    // }
    let codesmells = "";


    // ------------------------------------------------Long Parameter List------------------------------------------
    let count_long_params = 0;
    let code_lines = text.split(/[\n]/); // Get each line of python code
    console.log('Parameters');
    for (let i = 0; i < code_lines.length; i++) {
      // Find def in code line
      let line = code_lines[i];
      if (line.search(/\bdef\b/) !== -1) {
        // Count the number of commas
        count_long_params += (line.match(/,/g) || []).length;

        if (count_long_params === 0) {
          if (line.search(/\(\s*\)/) === -1) {
            count_long_params++;
          }
        } else {
          count_long_params++;
        }
        console.log(
          'Line ' +
            i +
            ' ' +
            line.trim().split(' ')[1].split('(')[0] +
            ', params: ' +
            count_long_params
        );
        if (count_long_params >= 5) {
          console.log('Long Parameter code smell detected');
          // highlight the line
          console.log(element_array[i]);
          element_array[i].style.backgroundColor="#FF7F7F";
        }
        count_long_params = 0;
      }
    }



    //-----------------------------------------color contrastjupyter---------------------------------------

    //accepted color format rgb hex,rgba hex,cycle color,single letter,color name
    function hexToRgb(hex) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });
    
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
    function luminance(r, g, b) {
        var a = [r, g, b].map(function (v) {
            v /= 255;
            return v <= 0.03928
                ? v / 12.92
                : Math.pow( (v + 0.055) / 1.055, 2.4 );
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
    function contrast(rgb1, rgb2) {
        var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
        var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
        var brightest = Math.max(lum1, lum2);
        var darkest = Math.min(lum1, lum2);
        return (brightest + 0.05)
            / (darkest + 0.05);
    }
    lines = text.split('\n')
    colors = []
    convert = new Map([
      ["C0", "#1f77b4"],
      ["C1", "#ff7f0e"],
      ["C2", "#2ca02c"],
      ["C3", "#d62728"],
      ["C4", "#9467bd"],
      ["C5", "#8c564b"],
      ["C6", "#e377c2"],
      ["C7", "#7f7f7f"],
      ["C8", "#bcbd22"],
      ["C9", "#17becf"],
      ["r" , "#ff0000"],
      ["g" , "#00FF00"],
      ["b" , "#0000FF"],
      ["c" , "#00FFFF"],
      ["m" , "#ff00ff"],
      ["y" , "#FFFF00"],
      ["k" , "#000000"],
      ["w" , "#FFFFFF"],
      ["red" , "#ff0000"],
      ["green" , "#00FF00"],
      ["blue" , "#0000FF"],
      ["cyan" , "#00FFFF"],
      ["magenta" , "#ff00ff"],
      ["yellow" , "#FFFF00"],
      ["black" , "#000000"],
      ["white" , "#FFFFFF"],
    ]);
    for(let i=0;i<lines.length;i++)
    {
        let result =lines[i].search('color')
        let color = ""
        if(result!=-1)
        {
          for(j =result+7;j<lines[i].length;j++)
        {
          if(lines[i][j]==="'")
          break;
          color = color.concat(lines[i][j])
        }
        if(color[0]!=='#')
        {
          console.log("convert",convert.get(color))
          colors.push(convert.get(color))
        }
        else
        {
          if(color.length>7)
          colors.push(color.substring(0,7).slice())
          else
          colors.push(color.slice())
        }
        }
    }
    console.log("colors in cell:",colors)
    if(colors.length>1)
    {
      for(let i =0;i<colors.length;i++)
      {
        for(j=i+1;j<colors.length;j++)
        {
          c1=[]
          c2=[]
          r1 = hexToRgb(colors[i])
          r2 = hexToRgb(colors[j])
          c1.push(r1.r)
          c1.push(r1.g)
          c1.push(r1.b)
          c2.push(r2.r)
          c2.push(r2.g)
          c2.push(r2.b)
          ans = contrast(c1,c2)
          if(ans<3)
          console.log(ans,"low contrast for colors",colors[i]," ",colors[j])
        }
      }
    }

    

    // ---------------------------------------------Long methods--------------------------------------------
    console.log('Methods');
    // splitting current cell text to array of individual lines in cell
    lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().split(' ')[0] === 'def') {
        let cnt = 1;
        let j = i;

        j++;
        // searching for first non comment and non empty line in the method
        while (j < lines.length && lines[j].search(/\S|$/) === lines[j].length || lines[j].trim()[0] === '#') {
          j++;
          continue;
        }

        // l will store the length of first non space character from start of line
        let l = lines[j].search(/\S|$/);

        j++;

        for (j; j < lines.length; j++) {
          if (lines[j].search(/\S|$/) === lines[j].length || lines[j].trim()[0] === '#') {  // if line is empty or it is comment line
            continue;
          } else if (lines[j].search(/\S|$/) >= l) { 
            cnt++;
          } else {  // end of method
            break;
          }
        }

        console.log('Line ' + i + ' , ' + lines[i].trim().split(' ')[1].split('(')[0] + ' : ' + cnt);

        // threshold for long method = 100
        if (cnt >= 100) {
          console.log('Long Methods code smell detected');
          element_array[i].style.backgroundColor="#ADD8E6";
        }
        i = j - 1;
      }
    }



    // -----------------------------------------Large class-----------------------------------------
    console.log('Classes');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().split(' ')[0] === 'class') {
        let cnt = 1;
        let j = i;

        j++;
        // searching for first non comment and non empty line in the method
        while (j < lines.length && lines[j].search(/\S|$/) === lines[j].length || lines[j].trim()[0] === '#') {
          j++;
          continue;
        }

        // l will store the length of first non space character from start of line
        let l = lines[j].search(/\S|$/);

        j++;

        for (j; j < lines.length; j++) {
          if (lines[j].search(/\S|$/) === lines[j].length  || lines[j].trim()[0] === '#') { // if line is empty or it is comment line
            continue;
          } else if (lines[j].search(/\S|$/) >= l) {
            cnt++;
          } else {  // end of class
            break;
          }
        }

        console.log(
          'Line : ' +
            i +
            ' , ' +
            lines[i].trim().split(' ')[1].split('(')[0] +
            ' : ' +
            cnt
        );

        // threshold for large class = 200
        if (cnt >= 200) { 
          console.log('Long class detected');
          element_array[i].style.backgroundColor="#90EE90";
        }
        i = j - 1;
      }
    }


    
    // ------------------------------------------------long lambda function----------------------------------
    console.log("Long Lambda Function")
    lines = text.split('\n');
    for(let i = 0; i < lines.length; i++){
      line = lines[i].trim();
      x = line.indexOf("lambda");
      if(x == -1)
        continue
      
      count = 0;
      flag = 0;
      for(let j = x; j < line.length; j++){
        if(line[j] == ':'){
          flag = 1;
        }
        if(flag == 1 && line[j] != ' '){
          count++;
        }
      }
      if(count > 40){
        console.log("Long Lambda Fuction detected !")
        element_array[i].style.backgroundColor="#ff3300";
      }
    }



    // --------------------------------------------Wild Card Imports------------------------------------
    let count_wildimports = 0;
    for (let i = 0; i < code_lines.length; i++) {
      let line = code_lines[i];
      if (line.search(/import\*/) !== -1 || line.search(/import \*/) !== -1) {
        count_wildimports++;
        element_array[i].style.backgroundColor="#00FFFF";

      }
      
    }
    console.log('Wild Import Smells: ' + count_wildimports);



    // ----------------------check if import statements are present and not in first cell-------------------
    for (let i = 0; i < code_lines.length; i++) {
      let line = code_lines[i];
      if (line.search(/import/) !== -1 && index != 0) {
        element_array[i].style.backgroundColor="#FFA500";
      }
    }



    // -----------------------------------------Running cells out of order-----------------------------------------

    let cells1 = document.getElementsByClassName("input_prompt")
    let num_of_cells = Jupyter.notebook.get_cells().length;
    let out_of_order_cells = [];

    for(let i=0; i<num_of_cells-1; i++){
      let x = cells1[i].textContent;
      
      if(/^-?\d+$/.test(x.substring(4, x.length-2))){
        j = i+1;
        while(j < num_of_cells && !(/^-?\d+$/.test(cells1[j].textContent.substring(4, cells1[j].textContent.length-2)))){
          j++
        }

        if(j < num_of_cells){
          let y = cells1[j].textContent;
          if(Number(x.substring(4, x.length-2)) > Number(y.substring(4, y.length-2))){
            out_of_order_cells.push(i);
            cells1[i].style.backgroundColor="#00FFFF";
          }
          else{
            cells1[i].style.backgroundColor="transparent";
          }
        }  

      }
    }

    console.log('Cells run in out of order : ', out_of_order_cells);




    // --------------------------------------unused variables-------------------------------------------

    variables = new Set();
    variableIndex = {};
    unusedVariables = new Set();

    // iterating each cell
    for(let i=0; i<num_of_cells; i++){
      let cellText = Jupyter.notebook.get_cells()[i].get_text();
      let cellLines = cellText.split('\n');

      // iterating each line of cell
      for(let k=0; k<cellLines.length; k++){

        // searching for strings with : "variable_name = "
        let assignExpressions = cellLines[k].trim().match(/^(([a-zA-Z_]([a-zA-Z_]|[0-9])*)\s*=)/);
        
        if(assignExpressions !== null){
          let exprVar = assignExpressions[0].substring(0, assignExpressions[0].indexOf('=')).trim();
          variables.add(exprVar);
          if(!(exprVar in variableIndex)){
            variableIndex[exprVar] = [i, k];
          }
        }
      }

    }

    console.log("vars", variableIndex)

    lhsVarCount = {};
    let setIterator = variables.values();
    for(const variable of setIterator){
      lhsVarCount[variable] = 0;

      // searching for assignment expressions where "variable" is used on right hand side of the expressions.
      // if "variable" is present on RHS of a asignment then we can conclude that it is not a unused a variable
      // Also if "variable" is present in return statement of a function, then too we can conclude it is not a unused variable
      let pattern = "^((([a-zA-Z_]([a-zA-Z_]|[0-9])*)\\s*=)|return|print\\()\\s*(.*[^_a-zA-Z0-9])?(" + variable + "([^_a-zA-Z0-9](.|[\\n])*)|" +  variable + "$)";
      let regex = new RegExp(pattern, "g");

      // iterating each cell
      for(let i=0; i<num_of_cells; i++){
        let cellText = Jupyter.notebook.get_cells()[i].get_text();
        let cellLines = cellText.split('\n');
        
        // iterating each line of cell
        for(let k=0; k<cellLines.length; k++){

          usedExpressions = cellLines[k].trim().match(regex);
          
          if(usedExpressions !== null){
            let exprVar = usedExpressions[0].substring(0, usedExpressions[0].indexOf('=')).trim();
            if(exprVar !== variable){
              lhsVarCount[variable] += 1;
            }
          }

        }
      }

      if(lhsVarCount[variable] === 0){
        unusedVariables.add(variable);
        cell_elements[variableIndex[variable][0]].getElementsByClassName("CodeMirror-line")[variableIndex[variable][1]].style.backgroundColor="#C1008C";
      }
    }

    console.log("unused varibles", unusedVariables);
    codesmells += "unused varibles" + unusedVariables;

    var a = document.createElement("div");
    a.innerHTML = "<div class=\"smellDetectorPopup popup\" id=\"kishorpopup\" onclick=\"myFunction()\">Click me\! <span class=\"popuptext\" id=\"myPopup\">" + codesmells + "</span> </div>"
    var styles = `/* Popup container */
    .popup {
      position: relative;
      display: inline-block;
      cursor: pointer;
    }
    
    /* The actual popup (appears on top) */
    .popup .popuptext {
      visibility: hidden;
      width: 160px;
      background-color: #555;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 8px 0;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;
      margin-left: -80px;
    }
    
    /* Popup arrow */
    .popup .popuptext::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: #555 transparent transparent transparent;
    }
    
    /* Toggle this class when clicking on the popup container (hide and show the popup) */
    .popup .show {
      visibility: visible;
      -webkit-animation: fadeIn 1s;
      animation: fadeIn 1s
    }
    
    /* Add animation (fade in the popup) */
    @-webkit-keyframes fadeIn {
      from {opacity: 0;}
      to {opacity: 1;}
    }
    
    @keyframes fadeIn {
      from {opacity: 0;}
      to {opacity:1 ;}
    }` 
    var styleSheet = document.createElement("style")
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  
    // if(!document.getElementsByClassName("smellDetectorPopup"))
      prompt.appendChild(a);



    // ----------------------------------------------Long Message chain-------------------------------------------
    lines = text.split('\n');
    for (let i = 0; i < lines.length; ++i) {
      let myArray = lines[i].split('.');
      if (myArray.length > 1) {
        let count = 0;
        myArray = myArray.slice(1);
        for (let j = 0; j < myArray.length; ++j) {
          if (myArray[j].indexOf('(') != -1) {
            ++count;
          }
        }
        if(count >= 4){
          console.log("Long Message chain detected.");
          element_array[i].style.backgroundColor="#FDFF47";
        }
      }
    }
  };

  

  // Clickable button in toolbar
  var detectSmellButton = function () {
    Jupyter.toolbar.add_buttons_group([
      Jupyter.keyboard_manager.actions.register(
        {
          help: 'Detect smells',
          icon: 'fa-bolt',
          handler: findSmells,
        },
        'detect-code-smell',
        'Smell Detector'
      ),
    ]);
  };

  function load_ipython_extension() {
    detectSmellButton();
  }
  return {
    load_ipython_extension: load_ipython_extension,
  };
});
