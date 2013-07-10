#pragma strict

public var Sensitivity : Vector2;

function Start () 
{
	
}

function Update () 
{
	Screen.showCursor = false;
	Screen.lockCursor = true;
	transform.localEulerAngles.y += Input.GetAxis("Mouse X") * Sensitivity.x;
	transform.localEulerAngles.x -= Input.GetAxis("Mouse Y") * Sensitivity.y;
	//transform.localEulerAngles.x = Mathf.Clamp(transform.localEulerAngles.x, -90, 90);
}