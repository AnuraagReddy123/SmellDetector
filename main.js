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
    // console.log(element_array);

    // Long Parameter List
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

    // Long methods
    console.log('Methods');
    lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().split(' ')[0] == 'def') {
        let cnt = 1;
        let j = i;

        j++;
        while (j < lines.length && lines[j].search(/\S|$/) == lines[j].length) {
          j++;
          continue;
        }

        let l = lines[j].search(/\S|$/);

        // console.log(lines[j].search(/\S|$/) + " : " + lines[j].length);

        j++;

        for (j; j < lines.length; j++) {
          // console.log(lines[j].search(/\S|$/) + " : " + lines[j].length);

          if (lines[j].search(/\S|$/) == lines[j].length) {
            continue;
          } else if (lines[j].search(/\S|$/) >= l) {
            cnt++;
          } else {
            break;
          }
        }
        console.log(
          'Line ' +
            i +
            ' , ' +
            lines[i].trim().split(' ')[1].split('(')[0] +
            ' : ' +
            cnt
        );
        if (cnt >= 100) {
          console.log('Long Methods code smell detected');
          element_array[i].style.backgroundColor="#ADD8E6";
        }
        i = j - 1;
      }
    }
    // Test

    // Large class
    console.log('Classes');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().split(' ')[0] == 'class') {
        let cnt = 1;
        let j = i;

        j++;
        while (j < lines.length && lines[j].search(/\S|$/) == lines[j].length) {
          j++;
          continue;
        }

        let l = lines[j].search(/\S|$/);

        j++;

        for (j; j < lines.length; j++) {
          if (lines[j].search(/\S|$/) == lines[j].length) {
            continue;
          } else if (lines[j].search(/\S|$/) >= l) {
            cnt++;
          } else {
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
        if (cnt >= 200) { 
          console.log('Long class detected');
          element_array[i].style.backgroundColor="#90EE90";
        }
        i = j - 1;
      }
    }

    
    //long lambda function
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
    }

    if(count > 40){
      console.log("Long Lambda Fuction detected !")
    }

    // Wild Card Imports
    let count_wildimports = 0;
    for (let i = 0; i < code_lines.length; i++) {
      let line = code_lines[i];
      if (line.search(/import\*/) !== -1 || line.search(/import \*/) !== -1) {
        count_wildimports++;
        element_array[i].style.backgroundColor="#00FFFF";
      }
    }
    console.log('Wild Import Smells: ' + count_wildimports);

    // Long Message chain
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
