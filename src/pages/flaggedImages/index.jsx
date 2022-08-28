import * as React from "react";

import axios from "axios";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import off from "../../off";
import { OFF_IMAGE_URL } from "../../const";

const getImageUrl = (code, imgid) =>
  `${OFF_IMAGE_URL}/${off.getFormatedBarcode(code)}/${imgid}.jpg`;

export default function FlaggedImages() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    axios
      .get("https://amathjourney.com/api/off-annotation/flag-image/")
      .then(({ data: { result } }) => setData(result))
      .catch(() => {
        setData([]);
      });
  }, []);

  if (data === null) {
    return <p>Loading</p>;
  }
  return (
    <Box>
      <Box sx={{ padding: 2 }}>
        <Typography>Images flagged by users</Typography>
        <table>
          {data.map(({ code, imgid }) => (
            <tr key={`${code}-${imgid}`}>
              <td>
                <a
                  target="_blank"
                  href={off.getProductEditUrl(code)}
                  rel="noreferrer"
                >
                  {code}
                </a>
              </td>
              <td>
                <img src={getImageUrl(code, imgid)} height={200} alt="" />
              </td>
              <td>
                <IconButton
                  onClick={() => {
                    axios.delete(
                      `https://amathjourney.com/api/off-annotation/flag-image/${code}`,
                      {
                        mode: "no-cors",
                        data: {
                          imgid,
                        },
                      }
                    );
                    setData((prev) =>
                      prev.filter(
                        (line) => line.code !== code || line.imgid !== imgid
                      )
                    );
                  }}
                >
                  <DeleteOutlineIcon sx={{ cursor: "pointer", color: "red" }} />
                </IconButton>
              </td>
            </tr>
          ))}
        </table>
      </Box>
    </Box>
  );
}