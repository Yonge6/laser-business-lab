const healthFunction = {
  fetch() {
    return Response.json({ ok: true, service: "maker-business-lab-report-email" });
  },
};

export default healthFunction;
