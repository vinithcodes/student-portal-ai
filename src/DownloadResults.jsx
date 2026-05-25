import { useEffect, useState } from "react";
import axios from "axios";

function DownloadResults() {

  const token = localStorage.getItem("token");

  const [results, setResults] = useState([]);

  useEffect(() => {

    axios.get(
      "http://127.0.0.1:8000/results/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    .then((res) => {

      setResults(res.data);

    })

    .catch((err) => {

      console.log(err);

    });

  }, []);

  // =====================================
  // DOWNLOAD RESULT
  // =====================================

  const handleDownload = (result) => {

    const content = `
Student Result

Semester : ${result.semester}

${result.marks.map(
  (m) =>
    `${m.subject_name} (${m.subject_code}) : ${m.mark}`
).join("\n")}
`;

    const blob = new Blob(
      [content],
      {
        type: "text/plain",
      }
    );

    const link =
      document.createElement("a");

    link.href =
      URL.createObjectURL(blob);

    link.download =
      `semester-${result.semester}-result.txt`;

    link.click();

  };

  return (

    <div className="bg-zinc-900 p-6 rounded-2xl">

      <h1 className="text-2xl font-bold text-white mb-6">

        Download Results

      </h1>

      <div className="space-y-4">

        {results.map((result) => (

          <div
            key={result.id}
            className="bg-zinc-800 p-4 rounded-xl flex items-center justify-between"
          >

            <div>

              <p className="text-white font-semibold">

                Semester {result.semester}

              </p>

              <p className="text-zinc-400 text-sm">

                {result.marks.length} Subjects

              </p>

            </div>

            <button
              onClick={() =>
                handleDownload(result)
              }
              className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl text-white"
            >

              Download

            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

export default DownloadResults;