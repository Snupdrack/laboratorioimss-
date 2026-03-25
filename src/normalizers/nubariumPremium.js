function normalizeNubariumPremium(payload) {
  const root = payload?.data ?? {};
  const semanas = root?.semanasCotizadas ?? {};

  return {
    provider: "nubarium_premium",
    transactionId: cleanText(payload?.validationCode),
    status: String(payload?.status || "").toLowerCase() === "ok" ? "ok" : "error",
    messageCode: payload?.messageCode ?? null,
    message: cleanText(payload?.message),

    person: {
      fullName: cleanText(root?.nombre),
      curp: cleanText(root?.curp),
      nss: cleanText(root?.nss)
    },

    summary: {
      totalWeeks: toInt(semanas?.semanasCotizadas),
      discountedWeeks: toInt(semanas?.semanasDescontadas),
      reinstatedWeeks: toInt(semanas?.semanasReintegradas)
    },

    jobs: ensureArray(root?.historialLaboral).map(normalizeJob),

    enriched: {
      currentStatus: cleanText(root?.enriquecido?.situacionActual?.estatus),
      lastBaseSalary: toMoneyNumber(root?.enriquecido?.situacionActual?.salarioBaseUltimo),
      lastJobDurationWeeks: toInt(root?.enriquecido?.antiguedad?.duracionUltimoEmpleo),
      currentSituationWeeks: toInt(root?.enriquecido?.antiguedad?.duracionSituacionActual),
      totalWorkedWeeks: toInt(root?.enriquecido?.antiguedad?.totalSemanasTrabajadas),
      uniqueEmployers: toInt(root?.enriquecido?.estabilidad?.totalEmpleadoresUnicos),
      employersPerYear: toFloat(root?.enriquecido?.estabilidad?.ratioEmpleadoresPorAnio),
      unemployedWeeks: toInt(root?.enriquecido?.estabilidad?.totalSemanasDesempleado),
      maxUnemploymentWeeks: toInt(root?.enriquecido?.estabilidad?.maxDuracionDesempleo)
    },

    salaryChanges: ensureArray(root?.cambiosSalario).map((item) => ({
      event: cleanText(item?.evento),
      baseSalary: toMoneyNumber(item?.salarioBase),
      updatedAt: toIsoDate(item?.fechaActualizacion)
    }))
  };
}

function normalizeJob(job) {
  const endDateRaw = cleanText(job?.fechaBaja);

  return {
    employerName: cleanText(job?.nombrePatron),
    employerRegistration: cleanText(job?.registroPatronal),
    state: cleanText(job?.entidadFederativa),
    startDate: toIsoDate(job?.fechaAlta),
    endDate: isVigente(endDateRaw) ? null : toIsoDate(endDateRaw),
    current: isVigente(endDateRaw),
    baseSalaryDaily: toMoneyNumber(job?.salarioBaseCotizacion),
    workedWeeks: toInt(job?.semanasLaborando),
    monthlySalary: toMoneyNumber(job?.salarioMensual)
  };
}

function ensureArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function cleanText(value) {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  return str.length ? str : null;
}

function toInt(value) {
  if (value === undefined || value === null || value === "") return 0;
  const n = parseInt(String(value).replace(/[^\d-]/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
}

function toFloat(value) {
  if (value === undefined || value === null || value === "") return 0;
  const n = parseFloat(String(value).replace(/[^\d.-]/g, ""));
  return Number.isNaN(n) ? 0 : n;
}

function toMoneyNumber(value) {
  if (value === undefined || value === null || value === "") return 0;

  const normalized = String(value)
    .replace(/\$/g, "")
    .replace(/\s+/g, "")
    .replace(/,/g, "");

  const n = Number(normalized);
  return Number.isNaN(n) ? 0 : n;
}

function isVigente(value) {
  if (!value) return false;
  return String(value).trim().toLowerCase() === "vigente";
}

function toIsoDate(value) {
  if (!value) return null;

  const str = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const [dd, mm, yyyy] = str.split("/");
    return `${yyyy}-${mm}-${dd}`;
  }

  return null;
}

module.exports = {
  normalizeNubariumPremium
};