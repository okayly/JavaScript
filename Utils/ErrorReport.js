/********************************************************************
Title : ErrorReport
Date : 2015.09.23
Update : 2016.08.22
Desc : 에러 리포트 메일 보내기
writer : dongsu
********************************************************************/
var nodemailer = require('nodemailer');

(function (exports) {
    var inst = {};
    
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'pocatcomServer@gmail.com',
            pass: 'pocatcom'
        }
    });
    
    //------------------------------------------------------------------------------------------------------------------
    inst.SendReport = function (msg) {
        var path_list = __dirname.split("/");
        var folder = (path_list.length > 4) ? path_list[3] : null;
        
        var mailOptions = {
            from: 'pocatcomServer@gmail.com', // sender address
            // to: 'dongsu.kim@pocatcom.com, jongwook.yoon@pocatcom.com', // list of receivers
            // to: 'dongsu.kim@pocatcom.com', // list of receivers
            to: 'jongwook.yoon@pocatcom.com', // list of receivers
            subject: 'Error Report - ' + folder, // Subject line
            text: msg
        };

        // console.log(msg);        
        transporter.sendMail(mailOptions, function (p_error, p_info) {
            if ( p_error ) {
                return console.log(p_error);
            }            
            // console.log('Message sent: ' + p_info.response);
        });
    }

    //------------------------------------------------------------------------------------------------------------------
    inst.SendReportExecption = function (p_uuid, p_account, p_ack_cmd, p_error) {
        var str_log = 'UUID : ' + p_uuid + ' Account : ' + p_account + ' Ack Cmd : ' + p_ack_cmd + '\nError - ' + p_error;
        inst.SendReport(str_log);
        logger.error(str_log);
    }
    
    //------------------------------------------------------------------------------------------------------------------
    exports.inst = inst;

})(exports || global);
(exports || global).inst;