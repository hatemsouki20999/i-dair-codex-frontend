import { makeStyles } from '@mui/styles';

const inputComponentStyles = makeStyles({

  content: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "2vw",
    "& .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root": {
      width: "25vw"
    }
  },
  label: {
    color: "#616161"
  }
},{index:1});

export default inputComponentStyles