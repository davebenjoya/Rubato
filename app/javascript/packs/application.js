// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")
//= require jquery
//= require jquery_ujs
//= require_tree .
import index from '../controllers/index'

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)


// ----------------------------------------------------
// Note(lewagon): ABOVE IS RAILS DEFAULT CONFIGURATION
// WRITE YOUR OWN JS STARTING FROM HERE 👇
// ----------------------------------------------------


// External imports
import "bootstrap";
import flatpickr from "flatpickr";
// Internal imports, e.g:
// import { initSelect2 } from '../components/init_select2';
// import { dragstart_handler, dragover_handler, drop_handler } from '../components/dnd.js';
import { LessonDateWithFlatpickr } from '../components/flatpickr';
import { LessonTimeWithFlatpickr } from '../components/flatpickr';
import { OpenFormOnBtnClick } from '../components/form-button';
import { SelectAndUnselectSongOnClick } from '../components/song_modal_on_student_page';
import { ReloadSongList } from '../components/reload_song_list';
import { dnd } from '../components/dnd'
import { lyrics } from '../components/lyrics'
import { indexSong } from '../components/index_song';
import { newSong } from '../components/new_song';
import { showSong } from '../components/show_song';
import { editSong } from '../components/edit_song';
import { showAvatar } from '../components/show_uploaded_avatars';
import { selectNavbarCategoryOnClick } from '../components/select_navbar_category_on_click';
import { GoToStudentSongFromSongIndex } from '../components/go_to_student_song_from_song_index';

document.addEventListener('turbolinks:load', (ev) => {


  indexSong();
  newSong();
  dnd();
  editSong();
  // lyrics();
  LessonDateWithFlatpickr();
  LessonTimeWithFlatpickr();
  OpenFormOnBtnClick();
  SelectAndUnselectSongOnClick();
  showAvatar();
  ReloadSongList();
  showSong();
  selectNavbarCategoryOnClick();
  GoToStudentSongFromSongIndex();


  // Call your functions here, e.g:
  // initSelect2();
});

import "controllers"
