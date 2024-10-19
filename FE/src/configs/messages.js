// Login function
const LOGIN_NOT_ALLOW = "You do not have permission to login!";
const LOGIN_FAILED = "Login failed!";
const ENTER_EMAIL = "Please enter your email!";
const VALID_EMAIL = "Please enter a valid format!";
const ENTER_PASSWORD = "Please enter your password!";

/*************************** MANAGER **************************/
// Users
const ADD_USER_SUCCESS = "Add user successfully!";
const ADD_USER_FAILED = "Failed to add user!";
const EDIT_USER_SUCCESS = "Edit user successfully!";
const EDIT_USER_FAILED = "Failed to edit user!";
const DELETE_USER_SUCCESS = "Delete user successfully!";
const DELETE_USER_FAILED = "Failed to delete user!";
const FETCH_USERS_FAILED = "Failed to fetch users data!";
const IMPORT_USERS_SUCCESS = "Import users successfully!";
const IMPORT_USERS_FAILED = "Failed to import users!";

// Semester
const FETCH_SEMESTERS_FAILED = "Failed to fetch semesters data!";
const ADD_SEMESTER_SUCCESS = "Add semester successfully!";
const ADD_SEMESTER_FAILED = "Failed to add semester!";
const EDIT_SEMESTER_SUCCESS = "Edit semester successfully!";
const EDIT_SEMESTER_FAILED = "Failed to edit semester!";

// Subject
const ADD_SUBJECT_SUCCESS = "Add subject successfully!";
const ADD_SUBJECT_FAILED = "Failed to add subject!";
const EDIT_SUBJECT_SUCCESS = "Edit subject successfully!";
const EDIT_SUBJECT_FAILED = "Failed to edit subject!";
const DELETE_SUBJECT_SUCCESS = "Delete subject successfully!";
const DELETE_SUBJECT_FAILED =
  "You can't delete this subject because it has been used in the exam schedule!";
const FETCH_SUBJECTS_FAILED = "Failed to fetch subjects data!";
// Exam
const ADD_EXAM_SUCCESS = "Add exam successfully!";
const ADD_EXAM_FAILED = "Failed to add exam!";
const EDIT_EXAM_SUCCESS = "Edit exam successfully!";
const EDIT_EXAM_FAILED = "Failed to edit exam!";
const DELETE_EXAM_SUCCESS = "Delete exam successfully!";
const DELETE_EXAM_FAILED =
  "You can't delete this exam because it has been used in the exam schedule!";
const FETCH_EXAM_FAILED = "Failed to fetch exam data!";

// Exam schedule
const ADD_EXAM_SCHEDULE_SUCCESS = "Add exam schedule successfully!";
const ADD_EXAM_SCHEDULE_FAILED = "Failed to add exam schedule!";
const EDIT_EXAM_SCHEDULE_SUCCESS = "Edit exam schedule successfully!";
const EDIT_EXAM_SCHEDULE_FAILED = "Failed to edit exam schedule!";
const DELETE_EXAM_SCHEDULE_SUCCESS = "Delete exam schedule successfully!";
const DELETE_EXAM_SCHEDULE_FAILED =
  "You can't delete this exam schedule because it was sent to manager!";
const FETCH_EXAM_SCHEDULE_FAILED = "Failed to fetch exam schedule data!";
// Configs
const FETCH_CONFIG_FAILED = "Failed to fetch configuration data!";
const UPDATE_CONFIG_SUCCESS = "Update configuration successfully!";
const UPDATE_CONFIG_FAILED = "Failed to update configuration!";

export {
  LOGIN_NOT_ALLOW,
  LOGIN_FAILED,
  ENTER_EMAIL,
  ENTER_PASSWORD,
  VALID_EMAIL,
  ADD_USER_SUCCESS,
  ADD_USER_FAILED,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILED,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILED,
  FETCH_USERS_FAILED,
  IMPORT_USERS_SUCCESS,
  IMPORT_USERS_FAILED,
  FETCH_SEMESTERS_FAILED,
  ADD_SEMESTER_SUCCESS,
  ADD_SEMESTER_FAILED,
  EDIT_SEMESTER_SUCCESS,
  EDIT_SEMESTER_FAILED,
  ADD_EXAM_SUCCESS,
  ADD_EXAM_FAILED,
  EDIT_EXAM_SUCCESS,
  EDIT_EXAM_FAILED,
  DELETE_EXAM_SUCCESS,
  DELETE_EXAM_FAILED,
  FETCH_EXAM_FAILED,
  FETCH_CONFIG_FAILED,
  UPDATE_CONFIG_SUCCESS,
  UPDATE_CONFIG_FAILED,
  ADD_SUBJECT_SUCCESS,
  ADD_SUBJECT_FAILED,
  EDIT_SUBJECT_SUCCESS,
  EDIT_SUBJECT_FAILED,
  DELETE_SUBJECT_SUCCESS,
  DELETE_SUBJECT_FAILED,
  FETCH_SUBJECTS_FAILED,
  ADD_EXAM_SCHEDULE_SUCCESS,
  ADD_EXAM_SCHEDULE_FAILED,
  EDIT_EXAM_SCHEDULE_SUCCESS,
  EDIT_EXAM_SCHEDULE_FAILED,
  DELETE_EXAM_SCHEDULE_SUCCESS,
  DELETE_EXAM_SCHEDULE_FAILED,
  FETCH_EXAM_SCHEDULE_FAILED,
};
