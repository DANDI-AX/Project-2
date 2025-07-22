const students = [
  {
    id: "BET001",
    password: "pass1",
    name: "Liya Kebede",
    age: 16,
    grade: "10",
    conduct: "A",
    photo: "girl1.jpg",
    scores: {
      Math: [18, 19, 55],
      Chemistry: [17, 18, 56],
      Physics: [19, 18, 58],
      Biology: [18, 18, 57],
      ICT: [20, 19, 59],
      AfaanOromoo: [17, 17, 50],
      EnglishGrammar: [18, 18, 52],
      Writing: [19, 17, 50],
    }
  },
  {
    id: "BET002",
    password: "pass2",
    name: "Kaleb Tadesse",
    age: 17,
    grade: "10",
    conduct: "B",
    photo: "boy.jpg",
    scores: {
      Math: [15, 14, 50],
      Chemistry: [13, 12, 47],
      Physics: [14, 15, 49],
      Biology: [16, 14, 48],
      ICT: [15, 13, 46],
      AfaanOromoo: [14, 13, 44],
      EnglishGrammar: [13, 12, 42],
      Writing: [12, 13, 40],
    }
  },
  {
    id: "BET003",
    password: "pass3",
    name: "Hawi Mekonnen",
    age: 16,
    grade: "10",
    conduct: "A",
    photo: "girl2.jpg",
    scores: {
      Math: [20, 20, 60],
      Chemistry: [20, 20, 60],
      Physics: [20, 20, 60],
      Biology: [19, 20, 59],
      ICT: [20, 20, 60],
      AfaanOromoo: [20, 19, 60],
      EnglishGrammar: [20, 19, 58],
      Writing: [20, 20, 60],
    }
  }
];

const percentileBadge = (score) => {
  if (score >= 90) return `<span class="badge green">Top 10%</span>`;
  if (score >= 80) return `<span class="badge yellow">Top 20%</span>`;
  if (score >= 70) return `<span class="badge orange">Top 30%</span>`;
  return `<span class="badge red">Fail</span>`;
};

if (window.location.pathname.includes("dashboard.html")) {
  const studentId = localStorage.getItem("studentId");
  if (!studentId) {
    window.location.href = "student-login.html";
  } else {
    // Find full student object by ID
    const student = students.find(s => s.id === studentId);
    if (!student) {
      // If student not found (maybe data tampered), logout and redirect
      localStorage.removeItem("studentId");
      window.location.href = "student-login.html";
    } else {
      // Fill profile
      document.getElementById("studentPhoto").src = student.photo;
      document.getElementById("studentName").textContent = student.name;
      document.getElementById("studentAge").textContent = student.age;
      document.getElementById("studentGrade").textContent = student.grade;
      document.getElementById("conductRating").textContent = student.conduct;
      document.getElementById("studentID").textContent = student.id;

      // Build grades table
      const gradesTable = document.getElementById("gradesTable");
      gradesTable.innerHTML = "";

      let totalAll = 0;
      let subjectCount = 0;

      // Calculate totals for all students for ranking
      const studentTotals = students.map(s => {
        const total = Object.values(s.scores).reduce((acc, arr) => acc + arr.reduce((a,b) => a + b, 0), 0);
        return { id: s.id, total };
      });
      studentTotals.sort((a,b) => b.total - a.total);

      for (let subject in student.scores) {
        const [test1, test2, final] = student.scores[subject];
        const total = test1 + test2 + final;
        totalAll += total;
        subjectCount++;

        const badge = percentileBadge(total);

        gradesTable.innerHTML += `
          <tr>
            <td>${subject}</td>
            <td>${test1}</td>
            <td>${test2}</td>
            <td>${final}</td>
            <td>${total} ${badge}</td>
          </tr>
        `;
      }

      const average = (totalAll / subjectCount).toFixed(2);

      // Find rank by total
      const rank = studentTotals.findIndex(s => s.id === student.id) + 1;

      document.getElementById("summary").innerHTML = `
        <p><strong>Total Subjects:</strong> ${subjectCount}</p>
        <p><strong>Total Marks:</strong> ${totalAll} / ${subjectCount * 100}</p>
        <p><strong>Average Score:</strong> ${average}</p>
        <p><strong>Rank:</strong> ${rank} / ${students.length}</p>
      `;

      // Logout button
      document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("studentId");
        window.location.href = "student-login.html";
      });
    }
  }
}
