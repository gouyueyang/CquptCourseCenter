<%@page import="java.util.Map"%>
<!--引入统一身份认证相关-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.net.*" %>

<%
System.out.println("获取的userID============================="+session.getAttribute("uid"));
System.out.println("获取的userName============================="+session.getAttribute("userName"));
if(session.getAttribute("uid") != null) {

	String uid = session.getAttribute("uid").toString();//
	String userName1 = session.getAttribute("userName").toString();//
	//2.放入Cookie
	Cookie unifyCode = new Cookie("userId", uid);
	Cookie userName = new Cookie("userName", URLEncoder.encode(userName1, "utf-8"));
	//System.out.println(URLEncoder.encode(userName1,"utf-8"));
	// 设置cookie过期时间为24小时。
	unifyCode.setMaxAge(60 * 60 * 1);
	userName.setMaxAge(60 * 60 * 1);
	
	// 在响应头部添加cookie
	response.addCookie(unifyCode);
	response.addCookie(userName);
}else {
	//退出登录后，session断开了,重启放入

//2.放入Cookie
	Cookie unifyCode = new Cookie("userId", "1");
	Cookie userName = new Cookie("userName", URLEncoder.encode("匿名用户", "utf-8"));
	//System.out.println(URLEncoder.encode(userName1,"utf-8"));
	// 设置cookie过期时间为24小时。
	unifyCode.setMaxAge(60 * 60 * 1);
	userName.setMaxAge(60 * 60 * 1);
	// 在响应头部添加cookie
	response.addCookie(unifyCode);
	response.addCookie(userName);

	session.setAttribute("uid", "1");//
	session.setAttribute("userName", "匿名用户");
	session.setAttribute("addr", request.getRemoteAddr());

}

	//统计该页面的访问量
	if (application.getAttribute("counter") == null) {
		application.setAttribute("counter", new Integer(0));
		System.out.println("count = 0");
	}
	Integer count = (Integer) application.getAttribute("counter");
	application.setAttribute("counter", new Integer(count.intValue() + 1));
	System.out.println(application.getAttribute("counter"));

%>

<html>
<head>
	<meta charset="UTF-8">
	<meta name="renderer" content="webkit|ie-stand">
	 <meta http-equiv="x-ua-compatible" content="ie=edge"/>
	<title>课程中心-课程列表</title>
	<link rel="stylesheet" type="text/css" href="../css/classInfShow/classList.css">
	<script src="../compatibility/jquery.js"></script>
</head>
<body>
	<div id="header" class="warp">
		<div class="warp_center">
			<div id="test"></div>
		</div>
	</div>

	<div id="logo" class="warp">
		<div class="warp_center">
			<div class="logo_warp">
				<span class="logo"></span>
				<span class="logo_text">课程中心</span>
			</div>
			<div id="search"></div>
		</div>
	</div>
	<div id="body" class="warp">
		<div class="warp_center" >
			<div class="left" id="body_left">
			</div>
			<div class="right">
				<div id="class_nav">
				</div>
				<div id="class_inf">
				</div>
				<div id="turnPage">
				</div>
			</div>
		</div>
	</div>
	<div id="footer" class="warp">
		<div class="warp_center">
				<span class="copyRight">
					版权所有 重庆邮电大学 地址：重庆市南岸区崇文路2号 邮编：400065
				</span>
		</div>
	</div>
	<iframe></iframe>
	<script src="../js/libs/react.min.js"></script>
	<script src="../js/libs/courseCenter.config.js"></script>
	<!-- <script src="../js/pages/classList.js"></script> -->
	<script src="../js/pages/classList/classList.bundle.js"></script>
</body>
</html>