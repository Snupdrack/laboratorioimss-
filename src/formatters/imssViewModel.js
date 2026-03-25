const dayjs = require("dayjs");

function buildImssViewModel(normalized) {
  return {
    fullName: normalized.person.fullName || "",
    nss: normalized.person.nss || "",
    curp: normalized.person.curp || "",

    totalWeeks: String(normalized.summary.totalWeeks || 0),
    discountedWeeks: String(normalized.summary.discountedWeeks || 0),
    reinstatedWeeks: String(normalized.summary.reinstatedWeeks || 0),

    issuedDate: dayjs().format("DD/MM/YYYY"),

    jobs: (normalized.jobs || []).map((job) => ({
      employerName: truncate(job.employerName, 45),
      employerRegistration: job.employerRegistration || "",
      state: job.state || "",
      startDate: formatDate(job.startDate),
      endDate: job.current ? "Vigente" : formatDate(job.endDate),
      salary: formatMoney(job.baseSalaryDaily)
    }))
  };
}

function formatDate(date) {
  if (!date) return "";
  return dayjs(date).format("DD/MM/YYYY");
}

function formatMoney(value) {
  const n = Number(value || 0);
  return `$ ${n.toFixed(2)}`;
}

function truncate(text, max) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "…" : text;
}

module.exports = {
  buildImssViewModel
};