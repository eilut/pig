import test from "node:test";
import assert from "node:assert/strict";
import {
  canRegisterStudent,
  getAvailablePrograms,
  getRemainingSeats,
  isProgramFull,
} from "../src/registration-rules.js";

test("returns only open programs for the selected directorate", () => {
  const programs = [
    { programId: 1, directorate: "حفاش", status: "open" },
    { programId: 2, directorate: "حفاش", status: "closed" },
    { programId: 3, directorate: "الرجم", status: "open" },
  ];

  assert.deepEqual(getAvailablePrograms(programs, "حفاش"), [programs[0]]);
});

test("calculates remaining seats by gender", () => {
  const program = {
    maleSeats: 10,
    femaleSeats: 8,
    currentMaleCount: 4,
    currentFemaleCount: 8,
  };

  assert.equal(getRemainingSeats(program, "male"), 6);
  assert.equal(getRemainingSeats(program, "female"), 0);
});

test("detects a full program when both seat counters are exhausted", () => {
  const program = {
    maleSeats: 5,
    femaleSeats: 5,
    currentMaleCount: 5,
    currentFemaleCount: 5,
  };

  assert.equal(isProgramFull(program), true);
});

test("blocks duplicate registration by ID number", () => {
  const result = canRegisterStudent({
    students: [{ idNumber: "100", phoneNumber: "777" }],
    programs: [
      { programId: 1, status: "open", maleSeats: 10, femaleSeats: 10, currentMaleCount: 0, currentFemaleCount: 0 },
    ],
    idNumber: "100",
    phoneNumber: "888",
    programId: 1,
    gender: "male",
  });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "duplicate_id");
});

test("blocks duplicate registration by phone number", () => {
  const result = canRegisterStudent({
    students: [{ idNumber: "101", phoneNumber: "777" }],
    programs: [
      { programId: 1, status: "open", maleSeats: 10, femaleSeats: 10, currentMaleCount: 0, currentFemaleCount: 0 },
    ],
    idNumber: "200",
    phoneNumber: "777",
    programId: 1,
    gender: "female",
  });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "duplicate_phone");
});

test("blocks registration when program is closed", () => {
  const result = canRegisterStudent({
    students: [],
    programs: [
      { programId: 1, status: "closed", maleSeats: 10, femaleSeats: 10, currentMaleCount: 0, currentFemaleCount: 0 },
    ],
    idNumber: "300",
    phoneNumber: "900",
    programId: 1,
    gender: "male",
  });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "program_closed");
});

test("blocks registration when gender seats are exhausted", () => {
  const result = canRegisterStudent({
    students: [],
    programs: [
      { programId: 1, status: "open", maleSeats: 1, femaleSeats: 10, currentMaleCount: 1, currentFemaleCount: 0 },
    ],
    idNumber: "400",
    phoneNumber: "901",
    programId: 1,
    gender: "male",
  });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "program_full");
});

test("allows registration when all checks pass", () => {
  const result = canRegisterStudent({
    students: [{ idNumber: "500", phoneNumber: "1000" }],
    programs: [
      { programId: 1, status: "open", maleSeats: 5, femaleSeats: 5, currentMaleCount: 1, currentFemaleCount: 1 },
    ],
    idNumber: "600",
    phoneNumber: "1100",
    programId: 1,
    gender: "female",
  });

  assert.equal(result.allowed, true);
  assert.equal(result.reason, "allowed");
});
