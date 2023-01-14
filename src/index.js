const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");

const app = express();

app.use("/", express.static("public"));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + ".xlsx");
  },
});

const upload = multer({ storage: storage });

app.post("/extract-text", upload.single("file"), (req, res) => {

  const wb = xlsx.readFile("./uploads/file.xlsx", { dateNF: "dd/mm/yyyy" });
  const ws = wb.Sheets[wb.SheetNames[0]];

  const data = xlsx.utils.sheet_to_json(ws, { raw: false });

  data.splice(0, 5);
  data.splice(data.length - 8, 8);

  let newData = [];
  newData = data.filter((d) => {
    if (parseInt(d["__EMPTY"].slice(6)) > 2014 && (d[
        "                  Agência Nacional do Petróleo, Gás Natural e Biocombustíveis"
      ] === "Asfalto Diluído de Petróleo de Cura Média 30 (R$/kg)"||d[
        "                  Agência Nacional do Petróleo, Gás Natural e Biocombustíveis"
      ] === "Asfalto Diluído de Petróleo de Cura Rápida 250 (R$/kg)"||d[
        "                  Agência Nacional do Petróleo, Gás Natural e Biocombustíveis"
      ] === "Cimento Asfáltico de Petróleo 30 45 (R$/kg)"||d[
        "                  Agência Nacional do Petróleo, Gás Natural e Biocombustíveis"
      ] === "Cimento Asfáltico de Petróleo 50 70 (R$/kg)")) {
      d["produto"] =
        d[
          "                  Agência Nacional do Petróleo, Gás Natural e Biocombustíveis"
        ];
      delete d[
        "                  Agência Nacional do Petróleo, Gás Natural e Biocombustíveis"
      ];
      d["inicio"] = d["__EMPTY"];
      delete d["__EMPTY"];
      d["fim"] = d["__EMPTY_1"];
      delete d["__EMPTY_1"];
      d["norte"] = d["__EMPTY_2"];
      delete d["__EMPTY_2"];
      d["nordeste"] = d["__EMPTY_3"];
      delete d["__EMPTY_3"];
      d["centro"] = d["__EMPTY_4"];
      delete d["__EMPTY_4"];
      d["sul"] = d["__EMPTY_5"];
      delete d["__EMPTY_5"];
      d["sudeste"] = d["__EMPTY_6"];
      delete d["__EMPTY_6"];
      d["brasil"] = d["__EMPTY_7"];
      delete d["__EMPTY_7"];
      return d;
    }
  });
  fs.writeFileSync("./datajson.json", JSON.stringify(newData, null, 2));
  //console.log(JSON.stringify(newData, null, 2));
  res.setHeader('Content-Type', 'application/json');
  res.json(JSON.stringify(newData, null, 2));
});

app.listen(3000);
console.log("ativo...");
