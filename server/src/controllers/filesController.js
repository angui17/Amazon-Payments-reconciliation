exports.upload = async (req, res, next) => {
  try {
    // placeholder: enqueue CSV processing job
    res.json({ ok: true, file: req.file?.filename || null });
  } catch (err) { next(err) }
}
