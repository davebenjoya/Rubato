import lc from "./libraryChords.json"


const buildDiagrams  =  () => {


  const editPageIdentifier = document.querySelector(".edit-page-identifier");

  if (editPageIdentifier) {


      let stringSpace = 10.8;
      let fretSpace = 28;
      let dotDefaultX = -1;
      let dotDefaultY = 6;



      let oSvg = null;
      let xSvg = null;

      let selectedVoicing = null;






      const fetchChordData = (newString, node) => {
        if (node.parentNode.parentNode.id === 'library') {
        console.log('fetch chord data');
        lc.chords.forEach(chord => {
          let firstFret = parseInt(chord.highestFret[0]) - 3;
          if (firstFret < 0) firstFret = 0;
          if (newString === chord.chordName) {
            // console.log('node   ' + node);

            const dgm =  node.parentNode.querySelector('.chord-diagram');
            oSvg = dgm.dataset.oSvg;
            xSvg = dgm.dataset.xSvg;
            const highestFret = dgm.dataset.highestFret;
            if (highestFret === chord.highestFret) {  // only display selected voicing
              if (!dgm.parentNode.querySelector('.first-fret')) {
                dgm.insertAdjacentHTML("afterend", `<div class='first-fret'>${firstFret}</div>`);
                // const stringArray = chord.strings.split(" ");
                const fingerArray = chord.fingering.split(" ");
                let fretHtml = placeDots(chord, node, firstFret);

                dgm.insertAdjacentHTML('afterbegin', fretHtml);
                node.parentNode.querySelector(".trash").insertAdjacentHTML('beforeend', `<i id="${chord.chordName}-voicings-btn" class="fas fa-cog voicings-btn"></i>`);
                // node.parentNode.querySelector(".voicings-btn").addEventListener('click', showVoicings);

                displayBarres(fingerArray, dgm);
              }
            }
          }
        });
        }
      };

      function placeDots(chord, node, firstFret = 0){
        const dgm =  node.parentNode.querySelector('.chord-diagram');
        const stringArray = chord.strings.split(" ");
        const fingerArray = chord.fingering.split(" ");
        let xPos = dotDefaultX + "px";
        let yPos = dotDefaultY + "px";

        const dotSvg = `<div class='dot'></div>`
        let myHtml = ``;
        stringArray.forEach( (fretNumber, index) => {
          switch (fretNumber) {
            case "X":
              xPos =( dotDefaultX + (stringSpace * index)) + 'px';
              yPos = dotDefaultY + 'px';
              myHtml += `<div id=${chord.chordName}X${index.toString()} style='position: absolute; left: ${xPos}; top:${yPos}'>${xSvg}</div></div>`;
              break;
            case "0":
              xPos =( dotDefaultX + (stringSpace * index)) + 'px';
              yPos = dotDefaultY + 'px';
              myHtml += `<div id=${chord.chordName}0${index.toString()} style='position: absolute; left: ${xPos}; top:${yPos}'>${oSvg}</div></div>`;
              break;
            default:
              xPos =( dotDefaultX + (stringSpace * index)) + 'px'; // offset width of dot / 2
              yPos =( dotDefaultY + ( fretSpace * (fretNumber - firstFret))) + 'px';
              const finger = fingerArray[index];
              myHtml += `<div class='barre' id=${chord.chordName}dot${index.toString()} style='position: absolute; left: ${xPos}; top:${yPos}'>${dotSvg}<div class='finger'>${finger}</div></div>`;
              break;
            }
        });
        return myHtml;
      }

      function displayBarres(fingerArray, dgm) {
        let firstFingers = [];
        let secondFingers = [];
        let thirdFingers = [];
        let fourthFingers = [];
        const allFingers  =[firstFingers,secondFingers, thirdFingers, fourthFingers]

        fingerArray.forEach( (num, index) => {
          switch (num) {
            case '1': firstFingers.push(index);
            break;
            case '2': secondFingers.push(index);
            break;
            case '3': thirdFingers.push(index);
            break;
            case '4': fourthFingers.push(index);
            break;
            default: null;
          }
        });


        allFingers.forEach((arr, index )=> {
          if (arr.length > 1) {  // finger frets more than one string
            const fingers  = dgm.querySelectorAll('.finger');
            let barreArray = []
            fingers.forEach( (fin, ind) => {
            if (fin.innerHTML === (index + 1).toString() ) { // finger number matches embedded array
              barreArray.push(fin);
            }
          });

          barreArray.forEach((fin, index) => {
            if (index === 0) {// first occurrance of barring finger -- increase width to cover all barred strings
              // const firstDotX + barreArray[0].parentNode.querySelector(".dot").getBoundingClientRect().left;

              const firstDotX = barreArray[index].parentNode.querySelector(".dot").getBoundingClientRect().left;
              const lastDotX = barreArray[barreArray.length - 1].parentNode.querySelector(".dot").getBoundingClientRect().left;
              const barreWidth = (lastDotX - firstDotX) + barreArray[index].parentNode.querySelector(".dot").getBoundingClientRect().width + 1;

              // console.log('barreWidth   ' + barreWidth);
              fin.parentNode.querySelector(".dot").style.setProperty("width", `${barreWidth}px`);
              fin.parentNode.querySelector(".dot").dataBarre = true;
            } else {
              fin.parentNode.remove();
            }
          });
        };
      });
    };

      function showVoicings () {
        // console.log('showVoicings');
        const node = event.target.parentNode.parentNode.parentNode.querySelector(".chord_name");
        hideVoicings();
        node.parentNode.classList.add('draggable-selected');
        currentChordName = node.value;

        let selected = false;



        const voicingsTemp = document.querySelector('#voicings_template').content.firstElementChild.cloneNode(true);
        document.querySelector('#save-area').insertAdjacentHTML('beforeend', voicingsTemp.outerHTML);
        document.querySelector('#voicings-header').innerHTML = `${currentChordName}`

        const voicingsDiv =  document.querySelector('#voicings');
        const voicingsArray = buildVoicingsArray();
        voicingsArray.forEach((voicing, index) => {
          console.log(index);
          document.querySelectorAll('.draggable').forEach ( d => {
            const libChordName = d.querySelector(".chord_name");
            if (libChordName.value === currentChordName){
              const libDgm = libChordName.parentNode.querySelector('.chord-diagram');

              if (voicing.highestFret  === libDgm.dataset.highestFret) {
                selected = true;
              } else {
                selected = false;
              }
            }
          });

          let firstFret = parseInt(voicing.highestFret) - 3;
          if (firstFret < 0) firstFret = 0;

          const voicingHtml =  `<div id="${voicing.chordName}-${index+1}" class='voicing' data-highest-fret="${voicing.highestFret}" ><img src='../../assets/fingerboard.svg' class= 'chord-diagram'></div>`

          voicingsDiv.insertAdjacentHTML('beforeend', voicingHtml);

          const voicingDiv =  voicingsDiv.querySelectorAll('.voicing')[index];
          if (selected) {
            voicingDiv.classList.add("voicing-selected");
            selectedVoicing = voicingDiv;
          }
           stringSpace = 20;
           fretSpace = 60;
           dotDefaultX = 0;
           dotDefaultY = -16;
          voicingDiv.insertAdjacentHTML("beforeend", `<div class='first-fret-voicing'>${firstFret}</div>`);
          const fingerArray = voicing.fingering.split(" ");
          let dotHtml = placeDots(voicing, voicingDiv, firstFret);

          voicingDiv.insertAdjacentHTML('beforeend', dotHtml);

          displayBarres(fingerArray, voicingDiv);
          resizeDots(voicingDiv);
          voicingDiv.addEventListener('click', selectVoicing);


        });
        // voicingsDiv.insertAdjacentHTML('beforeend', `<input type="checkbox" class="change-song-voicings">`);
        // voicingsDiv.querySelector(".change-song-voicings").addEventListener("click", toggleSongVoicings);

        voicingsDiv.parentNode.querySelector(".fa-window-close").addEventListener("click", hideVoicings);
        const chk = voicingsDiv.parentNode.querySelector("#change-song-voicings");
        chk.checked = songVoicings;
        chk.addEventListener("change", toggleSongVoicings);
        $('#voicings-bg').delay(100).animate({ opacity: 1 }, 350);
      };

      function toggleSongVoicings() {
        // console.log(' songVoicings '  + chk.songVoicings );
        songVoicings = !songVoicings;
      }

      function selectVoicing(ev) {
        // ev.preventDefault();
        if (selectedVoicing) {
          selectedVoicing.classList.remove('voicing-selected');
        }
        selectVoicingRemote(event.target);

        stringSpace = 10.8;
        fretSpace = 28;
        dotDefaultX = -1;
        dotDefaultY = 6;


        document.querySelectorAll('.draggable').forEach ( d => {
          const libChordName = d.querySelector(".chord_name");
          if (libChordName.value === currentChordName){
            const libDgm = libChordName.parentNode.querySelector('.chord-diagram');

            if (d.parentNode.id === "library" || songVoicings === true) {

            libDgm.querySelectorAll('.dot').forEach( dot => {
              dot.remove();
            });
            libDgm.querySelectorAll('.finger').forEach( finger => {
              finger.remove();
            });
            libDgm.querySelectorAll('.o').forEach( o => {
              o.remove();
            });

            const dgm = selectedVoicing.querySelector('.chord-diagram');
            const highest =  dgm.parentNode.dataset.highestFret;
            const result = lc.chords.filter(e => e.chordName === `${libChordName.value}` && e.highestFret === `${highest}`);

            dgm.parentNode.dataHighestFret = `${highest}`;
            d.parentNode.querySelectorAll("form").forEach(form =>{
              const currentName =  form.querySelector('.chord_name').value;
              if (currentName === libChordName.value) {
              const currentHighest =  form.querySelector('.update-chord').value;
              form.querySelector('.update-chord').value  = highest;
                console.log('currentName  ' + currentName);
                console.log('currentHighest  ' + currentHighest);
                form.remote = true;
                // console.log('form.remote  ' + form.remote );
                // const form = d.querySelectorAll("form");
                // const field = d.querySelector(".highest_fret");
                // const cId = form.querySelector(".chord_id")
                // const updateUrl = cId ;
                // form.highest_fret = highest;
                // console.log('field.value  ' + field.value);

                    /////////////     #1
                    /////////////    PATCH http://localhost:3000/chords/1608 422 (Unprocessable Entity)

              //   const Http = new XMLHttpRequest();
              // Http.open("PATCH", form.action);
              // Http.send();

              // Http.onreadystatechange = (e) => {
              //   // console.log(Http.responseText);
              //   console.log(' form.remote' + form.remote);
              // }

                    /////////////////     #2
                    ////////////////      reloads
              // form.submit(function(event) {
              //     event.preventDefault();
              //     return false;
              //   });


                     ////////////////////////////       #3
                     ///////////////////////////        reloads
                // form.submit(function(event) {
                //   event.preventDefault();
                //   $.ajax({
                //     type: "PATCH",
                //     url: form.attr('action'), //sumbits it to the given url of the form
                //     // data: {highest_fret: highest},
                //     dataType: "JSON" // you want a difference between normal and ajax-calls, and json is standard
                //   }).success(function(json){
                //       console.log("success", json);
                //   });
                // return false; // prevents normal behaviour
                // });
              };
            });

            let firstFret = parseInt(highest) - 3;
            if (firstFret < 0) firstFret = 0;

            const oldFret =  libDgm.parentNode.querySelector(".first-fret");
            const newFret = oldFret.outerHTML.replace(oldFret.textContent , firstFret);


            libDgm.parentNode.querySelector(".first-fret").outerHTML =  `${newFret}`;

            let fretHtml = placeDots(result[0], libDgm, firstFret);
            // console.log('fretHtml  ' + fretHtml);

            libDgm.insertAdjacentHTML('afterbegin', fretHtml);
               const fingerArray = result[0].fingering.split(" ");

                displayBarres(fingerArray, libDgm);
                shrinkBarre(fingerArray, libDgm);
            };
          }
        });

      }



      function selectVoicingRemote(voicing) {
        if (selectedVoicing) {
          selectedVoicing.classList.remove('voicing-selected');
        }
        selectedVoicing = voicing;
        voicing.classList.add('voicing-selected');
      }


      function resizeDots(voicingDiv){
        voicingDiv.querySelectorAll('.dot').forEach(dot => {
          dot.classList.add('bigdot');
          if (dot.dataBarre) {
            // console.log('resizzzzze');
          dot.style.width = parseInt(dot.style.width) + 7 + 'px';
          };
        });
        voicingDiv.querySelectorAll('.finger').forEach(finger => {
          finger.classList.add('bigfinger');
        });
        voicingDiv.querySelectorAll('.o').forEach(o => {
          o.classList.add('bigo');
        })
      };

      function shrinkBarre(array,libDiv){
        libDiv.querySelectorAll('.dot').forEach(dot => {
          dot.classList.remove('bigdot');
          if (dot.dataBarre) {
          dot.style.width = parseInt(dot.style.width) - 7 + 'px';
          };
        });
      };

    function buildVoicingsArray() {
      const voicingsArray = []
      lc.chords.forEach( chord => {
        if (chord.chordName === currentChordName) {
          voicingsArray.push(chord);
        }
      });
        return voicingsArray;
      };

    function hideVoicings () {
      const draggables = document.querySelectorAll(".draggable");
      draggables.forEach(draggable => {
        draggable.classList.remove("draggable-selected");
      })
      const v =  document.querySelector('#voicings-container');
      // const v2 =  document.querySelector('#voicings-header');
      if (v ) {
        v.remove();
        // v2.remove();
      }
      currentChordName = null;
    };


    const chords = Array.from(document.querySelectorAll(".draggable"));

    chords.forEach(chord => {
      let chordName = chord.children[0].value;
      const insertPoint = chord.querySelector(".chord-diagram");
      fetchChordData (chordName, insertPoint);
    });




  }


}


export { buildDiagrams }
