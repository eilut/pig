export function getAvailablePrograms(programs, directorate) {
  return programs.filter((program) => {
    return program.directorate === directorate && program.status === "open";
  });
}

export function isProgramFull(program) {
  const maleRemaining = Math.max((program.maleSeats ?? 0) - (program.currentMaleCount ?? 0), 0);
  const femaleRemaining = Math.max((program.femaleSeats ?? 0) - (program.currentFemaleCount ?? 0), 0);
  return maleRemaining === 0 && femaleRemaining === 0;
}

export function getRemainingSeats(program, gender) {
  if (gender === "male") {
    return Math.max((program.maleSeats ?? 0) - (program.currentMaleCount ?? 0), 0);
  }

  if (gender === "female") {
    return Math.max((program.femaleSeats ?? 0) - (program.currentFemaleCount ?? 0), 0);
  }

  throw new Error("Unsupported gender");
}

export function canRegisterStudent({ students, programs, idNumber, phoneNumber, programId, gender }) {
  const duplicateId = students.some((student) => student.idNumber === idNumber);
  if (duplicateId) {
    return { allowed: false, reason: "duplicate_id" };
  }

  const duplicatePhone = students.some((student) => student.phoneNumber === phoneNumber);
  if (duplicatePhone) {
    return { allowed: false, reason: "duplicate_phone" };
  }

  const existingRegistration = students.some(
    (student) => student.idNumber === idNumber || student.phoneNumber === phoneNumber,
  );
  if (existingRegistration) {
    return { allowed: false, reason: "duplicate_registration" };
  }

  const program = programs.find((item) => item.programId === programId);
  if (!program) {
    return { allowed: false, reason: "program_not_found" };
  }

  if (program.status !== "open") {
    return { allowed: false, reason: "program_closed" };
  }

  const remainingSeats = getRemainingSeats(program, gender);
  if (remainingSeats <= 0) {
    return { allowed: false, reason: "program_full" };
  }

  return { allowed: true, reason: "allowed" };
}
