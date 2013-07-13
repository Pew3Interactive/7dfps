#pragma strict

public var MovementImpulse : float;
public var MovementDampeningFactor : float;
public var FootLiftImpulse : float;
public var StepInterval : float;
public var Foot : FootResponder;
public var CameraSpringConstant : float;
public var WalkBobHeadTiltMaximumAngle : float;
public var WalkBobCycleInterval : float;
public var JumpImpulse : float;
public var MovementImpulseCurve : AnimationCurve;
public var HeadBobScaleCurve : AnimationCurve;
public var HeadBobRateScaleCurve : AnimationCurve;

private var RemainingTimeUntilNextStepIsAllowed : float;
private var RemainingTimeOfWalkBobCycle : float;
private var LiftedFootIndex : int = 1;
private var WasWalkingLastUpdate : boolean = false;
private var FakePosition : Vector3;
private var TimeSpentWalking : double;

function Start () 
{
	RemainingTimeUntilNextStepIsAllowed = 0;
	RemainingTimeOfWalkBobCycle = 0;
	WasWalkingLastUpdate = false;
	FakePosition = transform.position;
}

function Update () 
{

	var justStartedWalking : boolean = false;
	
	RemainingTimeUntilNextStepIsAllowed -= Time.deltaTime;
	if(Foot.IsOnWalkableSurface)
	{
		if(RemainingTimeUntilNextStepIsAllowed < 0)
		{
			var forwardImpulse = Input.GetAxis("Vertical") * MovementImpulse;
			var rightwardImpulse = Input.GetAxis("Horizontal") * MovementImpulse;
			if(rightwardImpulse != 0 || forwardImpulse != 0)
			{
				justStartedWalking = !WasWalkingLastUpdate;
				if(justStartedWalking) TimeSpentWalking = 0;
				else TimeSpentWalking += StepInterval;
				var scaleFactor = MovementImpulseCurve.Evaluate(TimeSpentWalking);
				var impulse = Quaternion.AngleAxis(transform.localEulerAngles.y, Vector3.up) * Vector3(rightwardImpulse * scaleFactor, FootLiftImpulse, forwardImpulse * scaleFactor);
				Foot.rigidbody.AddForce(impulse, ForceMode.Impulse);
				WasWalkingLastUpdate = true;
				RemainingTimeUntilNextStepIsAllowed = StepInterval;
			}
			else WasWalkingLastUpdate = false;
		}
		
		Foot.rigidbody.AddForce(Vector3.Scale(Vector3(1, 0, 1), -Foot.rigidbody.velocity) * MovementDampeningFactor);
	
		if(Input.GetButtonDown("Jump"))
		{
			Foot.rigidbody.AddForce(0, JumpImpulse, 0, ForceMode.Impulse);
		}
	}
	
	RemainingTimeOfWalkBobCycle -= Time.deltaTime * HeadBobRateScaleCurve.Evaluate(TimeSpentWalking);
	
	if(WasWalkingLastUpdate && RemainingTimeOfWalkBobCycle < 0) 
	{
		LiftedFootIndex *= -1;
		RemainingTimeOfWalkBobCycle = WalkBobCycleInterval;
	}
	
	if(justStartedWalking)
	{
		RemainingTimeOfWalkBobCycle = WalkBobCycleInterval;
	}
	
	var interpolationFactor : float = Mathf.Sin(3.14159 * Mathf.Clamp(RemainingTimeOfWalkBobCycle, 0, WalkBobCycleInterval) / WalkBobCycleInterval);
	transform.localEulerAngles.z = HeadBobScaleCurve.Evaluate(TimeSpentWalking) * LiftedFootIndex * WalkBobHeadTiltMaximumAngle * interpolationFactor;
	
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