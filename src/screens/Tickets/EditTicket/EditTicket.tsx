import { Box, FormLabel, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@material-ui/core";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UrlConstants } from "../../../global/UrlConstants";
import moment from "moment";
import { DropzoneArea } from "material-ui-dropzone";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    myDropZone: {
      position: "relative",
      width: "100%",
      height: "30%",
      minHeight: "100px",
      backgroundColor: "#F0F0F0",
      border: "dashed",
      borderColor: "#C8C8C8",
      cursor: "pointer",
      boxSizing: "border-box",
    },
    Typography: {
      color: "black",
      paddingTop: "0.3rem",
      paddingRight: "1rem",
      textAlign: "left",
    },
    select: {
      width: 220,
    },
    AddTicketInput: {
      // alignContent: "left",
      marginRight: "0.8rem",
      // padding: theme.spacing(0.4),
      // color: theme.palette.text.secondary,
      // textAlign: "center",
      // marginLeft: "7.2rem",
      // padding: "15px 15px",
      minWidth: 290,
      minHeight: 30,
    },
    root: {
      flexGrow: 1,
      padding: 16,
      backgroundColor: "#ede9e8",
      border: "1px solid black",
    },
    header: {
      textAlign: "center",
      color: theme.palette.text.secondary,
      marginBottom: "0.8rem",
      paddingBottom: "0.4rem",
      paddingTop: "0.7rem",
    },
    paper: {
      padding: theme.spacing(1.5),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    textField: {
      "&&": {
        marginTop: "0.7rem",
        marginBottom: "0.7rem",
        marginRight: "0.6rem",
      },
      backgroundColor: "#FFFFFF", //set text field color
    },
    dateField: {
      "&&": {
        marginTop: "0.7rem",
        marginBottom: "0.7rem",
        marginRight: "0.6rem",
        width: 220,
      },
      backgroundColor: "#FFFFFF", //set text field color
    },
  })
);

export default function EditTicket(props: any) {
  const classes = useStyles();
  const history = useHistory();
  const role = localStorage.getItem("role");
  const [data, setData] = useState(props.history.location.state?.data);
  const disableEdit =
    localStorage.getItem("role") === "superAdmin" ||
      (localStorage.getItem("role") === "Engineer" &&
        props.history.location.state?.data?.status === "OPEN")
      ? false
      : true;

  const disableStatusChange =
    localStorage.getItem("role") === "superAdmin" || localStorage.getItem("role") === "Admin" ||
      (localStorage.getItem("role") === "Engineer" &&
        props.history.location.state?.data?.status === "OPEN")
      ? false
      : true;

  const handleChange = (event: any) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let subUrl = localStorage.getItem("role") === "superAdmin" ? `admin/updateTicket/loggedInUserId/${localStorage.getItem("id")}` : `engineer/updateTicket`
    axios
      .patch(`${UrlConstants.baseUrl}/${subUrl}`, data)
      .then(function (response) {
        toast.success("Successfully Updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch(function (error) {
        toast.error("Error while updating!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
    setTimeout(() => history.push("/tickets"), 700);
  };

  const handleCancel = (e: any) => {
    e.preventDefault();
    history.goBack();
  };

  const handleViewDocument = () => {
    window.open(`${UrlConstants.baseUrl}/document/view/${data.docPath}`);
  };

  const handleDownloadDocument = (e: any) => {
    axios({
      url: `${UrlConstants.baseUrl}/document/download/${data.docPath}`, //your url
      method: "GET",
      responseType: "blob", // important
    }).then((response) => {
      // create file link in browser's memory
      const href = URL.createObjectURL(response.data);

      // create "a" HTML element with href to file & click
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", data.docPath); //or any other extension
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  };

  const onFileDropped = (files: any) => {
    if (!disableEdit) {
      if (files[0]?.name) {
        axios
          .post(
            `${UrlConstants.baseUrl}/document`,
            {
              userId: data.complaintNo,
              documentFile: files[0],
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then(function (response) {
            console.log(response);
            setData({ ...data, docPath: response.data.data.name });
            toast.success("Successfully Updated!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          })
          .catch(function (error) {
            toast.error("Error while Uploading Document!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          });
      }
    }
  };

  return (
    <>
      <Paper className={classes.root} elevation={12}>
        <Paper className={classes.header}>
          <TextField
            disabled
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            label="S/no"
            name="serialNo"
            value={data.serialNo}
            onChange={handleChange}
            size="small"
          />
          <TextField
            disabled={role !== "superAdmin"}
            className={classes.textField}
            label="Complaint No"
            InputLabelProps={{
              shrink: true,
            }}
            name="complaintNo"
            value={data.complaintNo}
            onChange={handleChange}
            size="small"
          />
          <TextField
            disabled={role !== "superAdmin"}
            type="datetime-local"
            className={classes.dateField}
            label="Complaint Date & Time"
            InputLabelProps={{
              shrink: true,
            }}
            name="complaintDatetime"
            defaultValue={data.complaintDatetime}
            onChange={handleChange}
            size="small"
          />
          <TextField
            disabled
            className={classes.textField}
            label="Engineer Assigned"
            InputLabelProps={{
              shrink: true,
            }}
            name="engineerAssigned"
            value={data.engineerAssigned}
            onChange={handleChange}
            size="small"
          />
          <TextField
            disabled
            className={classes.textField}
            label="Engineer Contact No"
            InputLabelProps={{
              shrink: true,
            }}
            name="engineerContactNo"
            value={data.engineerContactNo}
            onChange={handleChange}
            size="small"
          />
          <TextField
            disabled={role !== "superAdmin"}
            type="datetime-local"
            className={classes.dateField}
            label="Engineer Assigned On"
            InputLabelProps={{
              shrink: true,
            }}
            name="engineerAssignedDateTime"
            defaultValue={data.engineerAssignedDateTime}
            onChange={handleChange}
            size="small"
          />
        </Paper>
        <Grid container spacing={2}>
          <Grid item xs>
            <Paper className={classes.paper}>
              <Typography variant="h5">COMPLAIMENT DETAILS</Typography>
              <hr />
              <TextField
                disabled={role !== "superAdmin"}
                className={classes.textField}
                label="Complainant Name"
                InputLabelProps={{
                  shrink: true,
                }}
                name="complainantName"
                value={data.complainantName}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={role !== "superAdmin"}
                className={classes.textField}
                label="Contact No"
                InputLabelProps={{
                  shrink: true,
                }}
                id="complainantContactNo"
                name="complainantContactNo"
                value={data.complainantContactNo}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={role !== "superAdmin"}
                className={classes.textField}
                label="Project Name"
                InputLabelProps={{
                  shrink: true,
                }}
                name="projectName"
                value={data.projectName}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={role !== "superAdmin"}
                className={classes.textField}
                label="Product"
                InputLabelProps={{
                  shrink: true,
                }}
                id="product"
                name="product"
                value={data.product}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={role !== "superAdmin"}
                className={classes.textField}
                label="Machine Make"
                InputLabelProps={{
                  shrink: true,
                }}
                name="machineMake"
                value={data.machineMake}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={role !== "superAdmin"}
                className={classes.textField}
                label="Problem Type"
                InputLabelProps={{
                  shrink: true,
                }}
                name="problemType"
                value={data.problemType}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={role !== "superAdmin"}
                className={classes.textField}
                label="Machine Serial No"
                InputLabelProps={{
                  shrink: true,
                }}
                name="uxb1jsi364g4453780"
                value={data.uxb1jsi364g4453780}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={role !== "superAdmin"}
                className={classes.textField}
                label="Village/Town or Substation"
                InputLabelProps={{
                  shrink: true,
                }}
                name="substation"
                value={data.substation}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={role !== "superAdmin"}
                className={classes.textField}
                label="Landmark"
                InputLabelProps={{
                  shrink: true,
                }}
                name="landmark"
                value={data.landmark}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={role !== "superAdmin"}
                className={classes.textField}
                label="Circle"
                InputLabelProps={{
                  shrink: true,
                }}
                name="circle"
                value={data.circle}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={role !== "superAdmin"}
                className={classes.textField}
                label="Division"
                InputLabelProps={{
                  shrink: true,
                }}
                name="division"
                value={data.division}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={role !== "superAdmin"}
                className={classes.textField}
                label="Pincode"
                InputLabelProps={{
                  shrink: true,
                }}
                name="pinCode"
                value={data.pinCode}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={role !== "superAdmin"}
                className={classes.textField}
                label="Complainant Designation"
                InputLabelProps={{
                  shrink: true,
                }}
                name="complainantDesignation"
                value={data.complainantDesignation}
                onChange={handleChange}
                size="small"
              />
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={classes.paper}>
              <Typography variant="h5">DETAILS FILLED BY ENGINNER</Typography>
              <hr />
              <TextField
                disabled={disableEdit}
                className={classes.textField}
                label="Location Code"
                InputLabelProps={{
                  shrink: true,
                }}
                name="locationCode"
                value={data.locationCode}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={disableEdit}
                className={classes.textField}
                label="Defective Item Name"
                InputLabelProps={{
                  shrink: true,
                }}
                name="defectiveItemName"
                value={data.defectiveItemName}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={disableEdit}
                className={classes.textField}
                label="Old Serial No. MB/HDD/TFT"
                InputLabelProps={{
                  shrink: true,
                }}
                name="oldSerialNoMbHddTft"
                value={data.oldSerialNoMbHddTft}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={disableEdit}
                className={classes.textField}
                label="New Serial No. MB/HDD/TFT"
                InputLabelProps={{
                  shrink: true,
                }}
                name="newSerialNoMbHddTft"
                value={data.newSerialNoMbHddTft}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={disableEdit}
                className={classes.textField}
                label="Action Taken And Spare Useds"
                InputLabelProps={{
                  shrink: true,
                }}
                name="actionTakenAndSpareUsed"
                value={data.actionTakenAndSpareUsed}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={disableEdit}
                className={classes.dateField}
                type="datetime-local"
                label="Complaint Closed On"
                InputLabelProps={{
                  shrink: true,
                }}
                name="complaintCompletionDatetime"
                value={data.complaintCompletionDatetime}
                onChange={handleChange}
                size="small"
              />
              {/* <Box>
                <TextField
                  disabled
                  className={classes.textField}
                  label="Admin Response Time ( In Hours )"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  // name="responseTime"
                  value={
                    data.engineerAssignedDateTime &&
                    moment(data.engineerAssignedDateTime).diff(
                      moment(data.complaintDatetime),
                      "hours"
                    )
                  }
                  size="small"
                />
                <TextField
                  disabled
                  className={classes.textField}
                  label="Engineer Response Time ( In Hours )"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={
                    data.complaintCompletionDatetime &&
                    moment(data.complaintCompletionDatetime).diff(
                      moment(data.engineerAssignedDateTime),
                      "hours"
                    )
                  }
                  size="small"
                />
                <TextField
                  disabled
                  className={classes.textField}
                  label="Total Response Time ( In Hours )"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={
                    data.complaintCompletionDatetime &&
                    moment(data.complaintCompletionDatetime).diff(
                      moment(data.complaintDatetime),
                      "hours"
                    )
                  }
                  size="small"
                />
              </Box> */}
              <TextField
                disabled={disableEdit}
                type="datetime-local"
                className={classes.dateField}
                label="Complaint Attempts First Date & Time"
                InputLabelProps={{
                  shrink: true,
                }}
                name="complaintAttemptsFirstDateAndTime"
                defaultValue={data.complaintAttemptsFirstDateAndTime}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={disableEdit}
                type="datetime-local"
                className={classes.dateField}
                label="Complaint Attempts Second Date & Time"
                InputLabelProps={{
                  shrink: true,
                }}
                name="complaintAttemptsSecondDateAndTime"
                defaultValue={data.complaintAttemptsSecondDateAndTime}
                onChange={handleChange}
                size="small"
              />
              <TextField
                disabled={disableEdit}
                type="datetime-local"
                className={classes.dateField}
                label="Complaint Attempts Third Date & Time"
                InputLabelProps={{
                  shrink: true,
                }}
                name="complaintAttemptsThirdDateAndTime"
                defaultValue={data.complaintAttemptsThirdDateAndTime}
                onChange={handleChange}
                size="small"
              />
              {role === "Engineer" && (
                <Box>
                  <DropzoneArea
                    filesLimit={1}
                    dropzoneClass={classes.myDropZone}
                    showFileNamesInPreview={true}
                    acceptedFiles={["image/*"]}
                    dropzoneText={
                      data?.docPath
                        ? "Replace Image"
                        : "Drag and drop an image here or click"
                    }
                    // onChange={(files) => console.log("Files:", files)}
                    onChange={(files) => onFileDropped(files)}
                  ></DropzoneArea>
                </Box>
              )}
              {data?.docPath && (
                <Box>
                  <Typography>{data.docPath}</Typography>
                  <Button
                    style={{
                      color: "white",
                      backgroundColor: "#013220",
                      marginTop: 20,
                      marginLeft: 4,
                      marginBottom: 20,
                      minWidth: 120,
                    }}
                    onClick={handleViewDocument}
                  >
                    View Image
                  </Button>
                  <Button
                    style={{
                      color: "white",
                      backgroundColor: "#013220",
                      marginTop: 20,
                      marginLeft: 4,
                      marginBottom: 20,
                      minWidth: 120,
                    }}
                    onClick={handleDownloadDocument}
                  >
                    Download Image
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs>
          <Paper
            style={{
              marginTop: "0.7rem",
              paddingTop: "1rem",
              paddingBottom: "0.5rem",
            }}
          >
            <TextField
              // disabled={role === "aeit"}
              className={classes.textField}
              label="Remarks"
              InputLabelProps={{
                shrink: true,
              }}
              name="remarks"
              value={data.remarks}
              onChange={handleChange}
              size="small"
            />

            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="status"
                className={classes.textField}
                style={{ marginLeft: "2rem" }}
                defaultValue={data.status}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="Status"
                  control={<b />}
                  label="Status"
                />
                <FormControlLabel
                  value="OPEN"
                  control={<Radio />}
                  label="OPEN"
                  disabled={disableStatusChange}
                />
                <FormControlLabel
                  value="CLOSED"
                  control={<Radio />}
                  label="CLOSED"
                  disabled={disableStatusChange}
                />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>

        <Button
          variant="outlined"
          style={{
            color: "white",
            backgroundColor: "#900080",
            marginTop: 20,
            marginRight: 4,
            marginBottom: 20,
            minWidth: 120,
          }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          style={{
            color: "white",
            backgroundColor: "#f44336",
            marginTop: 20,
            marginLeft: 4,
            marginBottom: 20,
            minWidth: 120,
          }}
          type="submit"
          onClick={handleSubmit}
        >
          Save
        </Button>
      </Paper>

      <ToastContainer />
    </>
  );
}
