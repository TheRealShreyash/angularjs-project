app.controller("StudentController", [
  "$scope",
  "$cookies",
  function ($scope, $cookies) {
    // Cookie configurations (stores data for up to 7 days)
    var cookieKey = "student_directory_data";
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 7);
    var cookieOptions = { expires: expireDate };

    // Internal helper to sync array state to browser cookie storage
    function updateCookieStorage() {
      // Cookies store strings, so serialize arrays to JSON string formats
      $cookies.put(cookieKey, angular.toJson($scope.students), cookieOptions);
    }

    // Initialization routine: load existing cookies or fallback to baseline demo values
    var savedRecords = $cookies.get(cookieKey);
    if (savedRecords) {
      $scope.students = angular.fromJson(savedRecords);
    } else {
      $scope.students = [
        {
          rollNo: "CSE-401",
          name: "Elena Rostova",
          branch: "Computer Science",
          cgpa: 9.12,
        },
        {
          rollNo: "DS-108",
          name: "Marcus Vance",
          branch: "Data Science",
          cgpa: 8.45,
        },
        {
          rollNo: "CY-204",
          name: "Devon Lane",
          branch: "Cyber Security",
          cgpa: 7.89,
        },
      ];
      updateCookieStorage();
    }

    $scope.currentStudent = {};
    $scope.isEditing = false;

    // Form Submit Interceptor
    $scope.saveStudent = function () {
      if ($scope.isEditing) {
        for (var i = 0; i < $scope.students.length; i++) {
          if ($scope.students[i].rollNo === $scope.currentStudent.rollNo) {
            $scope.students[i] = angular.copy($scope.currentStudent);
            break;
          }
        }
      } else {
        var exists = $scope.students.some(function (s) {
          return (
            s.rollNo.toLowerCase() ===
            $scope.currentStudent.rollNo.toLowerCase()
          );
        });

        if (exists) {
          alert("Error: A student with this Roll Number already exists.");
          return;
        }

        $scope.students.push(angular.copy($scope.currentStudent));
      }

      updateCookieStorage(); // Persist changes immediately
      $scope.resetForm();
    };

    // Setup state for inline item updates
    $scope.editStudent = function (student) {
      $scope.isEditing = true;
      $scope.currentStudent = angular.copy(student);
    };

    // Remove Record
    $scope.deleteStudent = function (rollNo) {
      $scope.students = $scope.students.filter(function (student) {
        return student.rollNo !== rollNo;
      });

      updateCookieStorage(); // Persist drop action

      if ($scope.currentStudent.rollNo === rollNo) {
        $scope.resetForm();
      }
    };

    // Reset local controller model
    $scope.resetForm = function () {
      $scope.currentStudent = {};
      $scope.isEditing = false;
    };
  },
]);
