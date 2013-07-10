#pragma strict

public var MovementImpulse : float;
public var FootLiftImpulse : float;
public var StepInterval : float;
public var Foot : FootResponder;
public var CameraSpringConstant : float;

private var RemainingTimeUntilNextStepIsAllowed : float;

function Start () 
{
	RemainingTimeUntilNextStepIsAllowed = 0;
}

function Update () 
{
	RemainingTimeUntilNextStepIsAllowed -= Time.deltaTime;
	if(RemainingTimeUntilNextStepIsAllowed < 0 && Foot.IsOnWalkableSurface)
	{
		var forwardImpulse = Input.GetAxis("Vertical") * MovementImpulse;
		var rightwardImpulse = Input.GetAxis("Horizontal") * MovementImpulse;
		if(rightwardImpulse != 0 || forwardImpulse != 0)
		{
			var impulse = Quaternion.AngleAxis(transform.localEulerAngles.y, Vector3.up) * Vector3(rightwardImpulse, FootLiftImpulse, forwardImpulse);
			Foot.rigidbody.AddForce(impulse, ForceMode.Impulse);
			RemainingTimeUntilNextStepIsAllowed = StepInterval;
		}
	}
	
	//Now we update the camera, but a bit delayed
	transform.position = Foot.rigidbody.position;
	/*var difference = Foot.rigidbody.position - transform.position;
	var magnitude = difference.magnitude;
	if(magnitude > 0.1)
	{
		//var movement : Vector3 = Vector3.Scale(difference, difference) * Time.deltaTime * CameraSpringConstant / magnitude;
		var movement : Vector3 = difference * Time.deltaTime;
		transform.position += movement;
	}*/
}